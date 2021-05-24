import searchIcon from "../../resources/search.svg";
import { useHistory, useLocation } from "react-router";
import qs from "query-string";
import { useRef } from "react";

const Controls = props => {
  const searchRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const query = qs.parse(location.search);

  const sortHandler = e => {
    query.sort = e.target.value !== "" ? e.target.value : undefined;
    const queryString = qs.stringify(query);
    history.push(location.pathname + "?" + queryString);
  };

  const filterHandler = e => {
    query.filter = e.target.value !== "" ? e.target.value : undefined;
    const queryString = qs.stringify(query);
    history.push(location.pathname + "?" + queryString);
  };

  const searchHandler = e => {
    e.preventDefault();
    query.search =
      searchRef.current.value.trim() !== ""
        ? searchRef.current.value.trim()
        : undefined;
    const queryString = qs.stringify(query);
    history.push(location.pathname + "?" + queryString);
  };

  return (
    <div className="options-box">
      <form onSubmit={searchHandler} className="search-div">
        <input
          defaultValue={query.search || ""}
          ref={searchRef}
          className="search-bar"
          list="events-name"
          placeholder="Search with name"
        />
        <datalist id="events-name"></datalist>
        <button className="search-btn" type="submit">
          <img src={searchIcon} alt="search icon" />
        </button>
      </form>
      <div className="sidebar__btn-grp">
        <select
          defaultValue={query.sort || ""}
          onChange={sortHandler}
          className="select select--sort">
          <option default="default" value="">
            Sort
          </option>
          <option value="date-asc">Date &uarr;</option>
          <option value="date-desc">Date &darr;</option>
          <option value="distance-asc">Distance &uarr;</option>
          <option value="distance-desc">Distance &darr;</option>
        </select>
        <select
          defaultValue={query.filter || ""}
          onChange={filterHandler}
          className="select select--filter">
          <option default="default" value="">
            Filter
          </option>
          <option value="today">Today events</option>
          <option value="within-50km">Within 50 kms</option>
        </select>
      </div>
    </div>
  );
};

export default Controls;
