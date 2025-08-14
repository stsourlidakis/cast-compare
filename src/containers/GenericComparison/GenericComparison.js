import React, { Component } from "react";
import { flushSync } from "react-dom";
import ReactGA from "react-ga4";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import styles from "./GenericComparison.module.css";
import Autocomplete from "../../components/UI/Autocomplete/Autocomplete";
import ComparedItem from "../../components/ComparedItem/ComparedItem";
import Credits from "../../components/ComparedItem/Credits/Credits";

class GenericComparison extends Component {
  constructor(props) {
    super(props);
    const { config } = props;
    this.state = {
      items: [],
      pendingItems: [],
      autocompleteData: [],
      autocompleteNames: [],
      commonCredits: [],
      ...(config.extraStateFields || {}),
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    const { config } = this.props;

    if (this.props.params.ids) {
      const ids = this.props.params.ids.split(",");
      ids.forEach(this.getItemData);
    }

    const bodyEl = document.querySelector("body");
    bodyEl.className = "";
    bodyEl.classList.add(config.bodyClass);
    ReactGA.send({ hitType: "pageview", page: this.props.location.pathname });
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  searchChange = (e) => {
    const { config } = this.props;
    const searchValue = e.target.value;

    if (searchValue.length > 0) {
      config.autocompleteApi
        .get(`/?name=${searchValue}`)
        .then((res) => {
          if (!this._isMounted) return;

          this.setState({
            autocompleteData: res.data,
            autocompleteNames: res.data.map((match) => match.name),
          });
        })
        .catch((err) => {
          if (!this._isMounted) return;

          this.setState({ error: err.response.statusText });
          console.log(err.response.data.error);
        });
    }
  };

  searchSelect = (e) => {
    const { config } = this.props;
    const item = this.state.autocompleteData.find(
      (item) => item.name === e.target.value
    );

    if (item && item.id) {
      this.getItemData(item.id);
      e.target.value = "";

      ReactGA.event({
        category: config.gaCategory,
        action: "add",
        value: parseInt(item.id),
        label: item.name,
      });
    }
  };

  getItemData = (itemId) => {
    const { config } = this.props;
    this.addPendingItem(itemId);

    config.dataApi
      .get(config.getApiUrl(itemId))
      .then((res) => {
        if (!this._isMounted) return;

        flushSync(() => {
          const newItems = this.state.items.slice();
          const newItem = config.createNewItem(res.data);
          newItems.push(newItem);

          this.removePendingItem(itemId);

          this.setState({ items: newItems }, () => {
            this.updateCommonCredits();
            this.updateUrl();
          });
        });
      })
      .catch((err) => {
        if (!this._isMounted) return;

        this.removePendingItem(itemId);

        this.setState({ error: err.response.statusText });
        console.log(err.response.data);
      });
  };

  addPendingItem = (itemId) => {
    const newPendingItems = this.state.pendingItems.slice();
    newPendingItems.push({ id: itemId });
    this.setState({ pendingItems: newPendingItems });
  };

  removePendingItem = (itemId) => {
    const newPendingItems = this.state.pendingItems
      .slice()
      .filter((item) => item.id !== itemId);
    this.setState({ pendingItems: newPendingItems });
  };

  updateCommonCredits = () => {
    const { config } = this.props;

    if (this.state.items.length < 2) {
      this.setState({
        commonCredits: [],
        ...(config.resetExtraCounters ? config.resetExtraCounters() : {}),
      });
      return;
    }

    const creditLists = this.state.items
      .map((item) => item.credits)
      .sort((a, b) => a.length > b.length);
    const numberOfLists = creditLists.length;
    let commonCredits = [];
    let extraCounters = config.initExtraCounters
      ? config.initExtraCounters()
      : {};

    creditLists[0].forEach((credit) => {
      let isCommon = true;

      for (let i = 1; i < numberOfLists; i++) {
        if (!this.creditInCreditList(credit, creditLists[i])) {
          isCommon = false;
          break;
        }
      }

      if (isCommon) {
        const processedCredit = config.processCommonCredit
          ? config.processCommonCredit(credit)
          : credit;
        commonCredits.push(processedCredit);

        if (config.updateExtraCounters) {
          extraCounters = config.updateExtraCounters(credit, extraCounters);
        }
      }
    });

    this.setState({
      commonCredits,
      ...extraCounters,
    });
  };

  updateUrl = () => {
    const { config } = this.props;
    const ids = this.state.items.map((item) => item.id);
    const replaceOption =
      config.urlReplaceOption !== undefined
        ? { replace: config.urlReplaceOption }
        : {};
    this.props.navigate(`/${config.urlPath}/` + ids.join(","), replaceOption);
  };

  creditInCreditList = (credit, list) => {
    for (const c of list) {
      if (c.id === credit.id) {
        return true;
      }
    }
    return false;
  };

  removeItem = (itemIndex) => {
    const { config } = this.props;
    const newItems = this.state.items.slice();
    const removedItem = newItems.splice(itemIndex, 1);

    this.setState({ items: newItems }, () => {
      this.updateCommonCredits();
      this.updateUrl();
    });

    ReactGA.event({
      category: config.gaCategory,
      action: "remove",
      value: parseInt(removedItem[0].id),
      label: removedItem[0].name,
    });
  };

  render() {
    const { config } = this.props;
    let helpText = config.getInitialHelpText();
    let commonCredits = null;

    if (this.state.items.length > 1) {
      if (this.state.commonCredits.length > 0) {
        helpText = config.getCommonCreditsHelpText(this.state);

        commonCredits = (
          <div className={styles.commonCreditsWrapper}>
            <Credits
              credits={this.state.commonCredits}
              displayType="row"
              expanded
            />
          </div>
        );
      } else {
        helpText = config.noCommonCreditsText;
      }
    }

    return (
      <div className={styles.comparisonContainer} data-theme={config.theme}>
        <div className={styles.autocompleteWrapper}>
          <Autocomplete
            matches={this.state.autocompleteNames}
            change={this.searchChange}
            select={this.searchSelect}
            placeholder={config.placeholder}
            focused={true}
          />
        </div>
        <div className={styles.helpText}>{helpText}</div>
        {commonCredits}
        <div className={styles.itemsContainer}>
          {this.state.items.map((item, i) => (
            <ComparedItem
              key={i}
              data={item}
              remove={() => this.removeItem(i)}
            />
          ))}
          {this.state.pendingItems.map((item) => (
            <ComparedItem key={item.id} loading />
          ))}
        </div>
      </div>
    );
  }
}

// Wrapper to provide React Router v6 hooks to class component
const GenericComparisonWrapper = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <GenericComparison
      {...props}
      params={params}
      navigate={navigate}
      location={location}
    />
  );
};

export default GenericComparisonWrapper;
