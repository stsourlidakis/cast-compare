import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactGA from "react-ga4";
import { useParams, useLocation } from "react-router-dom";

import styles from "./GenericComparison.module.css";
import Autocomplete from "../../components/UI/Autocomplete/Autocomplete";
import ComparedItem from "../../components/ComparedItem/ComparedItem";
import Credits from "../../components/ComparedItem/Credits/Credits";

const creditInCreditList = (credit, list) => {
  return list.some((c) => c.id === credit.id);
};

const calculateCommonCredits = (items, config) => {
  if (items.length < 2) {
    return [];
  }

  const creditLists = items
    .map((item) => item.credits)
    .sort((a, b) => a.length > b.length);
  const numberOfLists = creditLists.length;
  const commonCredits = [];

  creditLists[0].forEach((credit) => {
    let isCommon = true;

    for (let i = 1; i < numberOfLists; i++) {
      if (!creditInCreditList(credit, creditLists[i])) {
        isCommon = false;
        break;
      }
    }

    if (isCommon) {
      const processedCredit = config.processCommonCredit
        ? config.processCommonCredit(credit)
        : credit;
      commonCredits.push(processedCredit);
    }
  });

  return commonCredits;
};

const GenericComparison = ({ config }) => {
  const [items, setItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [commonCredits, setCommonCredits] = useState([]);

  const abortControllerRef = useRef(null);
  const params = useParams();
  const location = useLocation();

  // Store search results to access item data
  const searchResultsRef = useRef([]);

  // Search function to be passed to Autocomplete
  const handleSearch = useCallback(
    async (searchValue) => {
      try {
        const res = await config.autocompleteApi.get(`/?name=${searchValue}`, {
          signal: abortControllerRef.current?.signal,
        });
        searchResultsRef.current = res.data;
        return res.data.map((match) => match.name);
      } catch (err) {
        if (err.name === "AbortError") return [];
        console.log(err.response?.data?.error || err.message);
        searchResultsRef.current = [];
        return [];
      }
    },
    [config.autocompleteApi]
  );

  const addPendingItem = useCallback((itemId) => {
    setPendingItems((prev) => [...prev, { id: itemId }]);
  }, []);

  const removePendingItem = useCallback((itemId) => {
    setPendingItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateCommonCredits = useCallback(() => {
    const newCommonCredits = calculateCommonCredits(items, config);
    setCommonCredits(newCommonCredits);
  }, [items, config]);

  const updateUrl = useCallback(() => {
    const ids = items.map((item) => item.id);
    const newUrl =
      ids.length > 0
        ? `/${config.urlPath}/${ids.join(",")}`
        : `/${config.urlPath}`;

    // Update URL without triggering navigation
    window.history.replaceState(null, "", newUrl);
  }, [items, config]);

  const getItemData = useCallback(
    async (itemId) => {
      addPendingItem(itemId);

      try {
        const res = await config.dataApi.get(config.getApiUrl(itemId), {
          signal: abortControllerRef.current?.signal,
        });

        const newItem = config.createNewItem(res.data);
        removePendingItem(itemId);
        setItems((prevItems) => [...prevItems, newItem]);
      } catch (err) {
        if (err.name === "AbortError") return;

        removePendingItem(itemId);
        console.log(err.response?.data || err.message);
      }
    },
    [config, removePendingItem, addPendingItem]
  );

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (params.ids) {
      const ids = params.ids.split(",");
      ids.forEach(getItemData);
    }

    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [params.ids, location.pathname, getItemData]);

  useEffect(() => {
    const bodyEl = document.body;
    const previousClasses = bodyEl.className;

    bodyEl.className = "";
    bodyEl.classList.add(config.bodyClass);

    return () => {
      bodyEl.className = previousClasses;
    };
  }, [config.bodyClass]);

  useEffect(() => {
    updateCommonCredits();
    updateUrl();
  }, [items, updateCommonCredits, updateUrl]);

  const searchSelect = useCallback(
    (e) => {
      const item = searchResultsRef.current.find(
        (item) => item.name === e.target.value
      );

      if (item && item.id) {
        getItemData(item.id);
        e.target.value = "";

        ReactGA.event({
          category: config.gaCategory,
          action: "add",
          value: parseInt(item.id),
          label: item.name,
        });
      }
    },
    [getItemData, config.gaCategory]
  );

  const removeItem = useCallback(
    (itemIndex) => {
      const newItems = [...items];
      const removedItem = newItems.splice(itemIndex, 1);

      setItems(newItems);

      ReactGA.event({
        category: config.gaCategory,
        action: "remove",
        value: parseInt(removedItem[0].id),
        label: removedItem[0].name,
      });
    },
    [items, config]
  );

  let helpText = config.getInitialHelpText();
  let commonCreditsElement = null;

  if (items.length > 1) {
    if (commonCredits.length > 0) {
      const metrics = config.getMetrics
        ? config.getMetrics(commonCredits)
        : { commonCredits };
      helpText = config.getCommonCreditsHelpText(metrics);

      commonCreditsElement = (
        <div className={styles.commonCreditsWrapper}>
          <Credits credits={commonCredits} displayType="row" fullListVisible />
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
          onSearch={handleSearch}
          onSelect={searchSelect}
          placeholder={config.placeholder}
          focused={true}
        />
      </div>
      <div className={styles.helpText}>{helpText}</div>
      {commonCreditsElement}
      <div className={styles.itemsContainer}>
        {items.map((item, i) => (
          <ComparedItem
            key={item.id}
            data={item}
            remove={() => removeItem(i)}
          />
        ))}
        {pendingItems.map((item) => (
          <ComparedItem key={item.id} loading />
        ))}
      </div>
    </div>
  );
};

export default GenericComparison;
