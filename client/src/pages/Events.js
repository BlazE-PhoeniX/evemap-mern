import CSSTransition from "react-transition-group/CSSTransition";
import { useCallback, useEffect, useState } from "react";
import Modal from "../components/modal/Modal";
import Sidebar from "../components/sidebar/Sidebar";
import Map from "../components/map/Map";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../store/events";

let coords, eventId;

const Events = props => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const user = useSelector(state => state.auth.user);
  const coordinates = useSelector(state => state.coords);
  const dispathRedux = useDispatch();

  useEffect(() => {
    dispathRedux(getAllEvents(coordinates, user));
  }, [dispathRedux, coordinates, user]);

  const showEmptyModal = useCallback(
    lnglat => {
      eventId = null;
      coords = lnglat;
      setEditMode(true);
      setShowModal(true);
    },
    [setEditMode, setShowModal]
  );

  const showFilledModal = useCallback(
    id => {
      coords = null;
      eventId = id;
      setEditMode(false);
      setShowModal(true);
    },
    [setEditMode, setShowModal]
  );

  const showFilledModalEdit = useCallback(
    id => {
      coords = null;
      eventId = id;
      setEditMode(true);
      setShowModal(true);
    },
    [setEditMode, setShowModal]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <>
      <main className="index-box">
        <Sidebar showFilledModal={showFilledModal} />
        <Map
          showEmptyModal={showEmptyModal}
          showFilledModal={showFilledModal}
          showFilledModalEdit={showFilledModalEdit}
          closeModal={closeModal}
        />
      </main>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={showModal}
        classNames="modal"
        timeout={500}>
        <Modal
          editMode={editMode}
          coords={coords}
          eventId={eventId}
          closeModal={closeModal}
          showFilledModalEdit={showFilledModalEdit}
        />
      </CSSTransition>
    </>
  );
};

export default Events;
