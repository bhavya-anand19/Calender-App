// src/features/calendar/calendarSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    events: [],
    modalOpen: false,
    formData: {
        title: "",
        category: "",
        start: "",
        end: "",
        color: "",
        date: "",
    },
};

// 🔁 GET all events
export const fetchEvents = createAsyncThunk("calendar/fetchEvents", async () => {
    const res = await axios.get("http://localhost:5000/api/events");

    return res.data.map((event) => ({
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        color: event.color,
        extendedProps: {
            category: event.extendedProps?.category || "",
        },
    }));
});

// ➕ POST new event
export const createEvent = createAsyncThunk("calendar/createEvent", async (eventData) => {
    const res = await axios.post("http://localhost:5000/api/events", eventData);
    const event = res.data;

    return {
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        color: event.color,
        extendedProps: {
            category: event.extendedProps?.category || "",
        },
    };
});

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        openModal(state) {
            state.modalOpen = true;
        },
        closeModal(state) {
            state.modalOpen = false;
        },
        updateFormData(state, action) {
            state.formData = { ...state.formData, ...action.payload };
        },
        resetFormData(state) {
            state.formData = initialState.formData;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.events = action.payload;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            });
    },
});

export const {
    openModal,
    closeModal,
    updateFormData,
    resetFormData,
} = calendarSlice.actions;

export default calendarSlice.reducer;
