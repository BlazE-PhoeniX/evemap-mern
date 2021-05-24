import EventsList from "../events/EventsList";
import Controls from "./Controls";

const Sidebar = props => {
  return (
    <div className="sidebar">
      <Controls />
      <EventsList showFilledModal={props.showFilledModal} />
      <footer className="footer">
        <p>&copy; Mini-project by group 3</p>
      </footer>
    </div>
  );
};

export default Sidebar;
