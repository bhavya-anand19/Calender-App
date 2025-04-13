import Modal from "react-modal";

import { FaTag, FaCalendarAlt, FaClock } from "react-icons/fa";
import "../App.css";
import axios from "axios";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import {
  updateFormData,
  closeModal,
  resetFormData,
  fetchEvents,
} from "../features/calendar/calendarSlice";

Modal.setAppElement("#root");

const categories = ["exercise", "eating", "work", "relax", "family", "social"];

const EventModal = ({ isOpen, onSubmit }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.calendar.formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
  };

  const handleDelete = async () => {
    if (!formData._id) return;
    await axios.delete(`http://localhost:5000/api/events/${formData._id}`);
    dispatch(closeModal());
    dispatch(resetFormData());
    dispatch(fetchEvents());
  };

  const isSubmitDisabled =
    !formData.title || !formData.category || !formData.start || !formData.end;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => dispatch(closeModal())}
      contentLabel="Add Event"
      className="modal"
      overlayClassName="overlay"
    >
      <button className="modal-close" onClick={() => dispatch(closeModal())}>
        &times;
      </button>

      <h2 className="modal-title">
        {formData._id ? "Edit Event" : "+ Create New Event"}
      </h2>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label className="input-label">
            <FaTag className="input-icon" />
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">
            <FaTag className="input-icon" />
            Category
          </label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="input-label">
            <FaCalendarAlt className="input-icon" />
            Start Time
          </label>
          <input
            type="datetime-local"
            name="start"
            value={formData.start || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">
            <FaClock className="input-icon" />
            End Time
          </label>
          <input
            type="datetime-local"
            name="end"
            value={formData.end || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn cancel"
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </button>

          {formData._id && (
            <button type="button" className="btn delete" onClick={handleDelete}>
              Delete
            </button>
          )}

          <button
            type="submit"
            className="btn create"
            disabled={isSubmitDisabled}
          >
            {formData._id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
