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

export const fetchEvents = createAsyncThunk("calendar/fetchEvents", async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events/`);


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

// POST new event
export const createEvent = createAsyncThunk(
    "calendar/createEvent",
    async (eventData, { rejectWithValue }) => {
        console.log("📤 Sending event to backend:", eventData);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/events`,
                eventData
            );
            console.log("✅ Response from backend:", res.data);

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
        } catch (error) {
            console.error("❌ createEvent API Error:", error.response?.data || error.message); // 👀 Log error
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


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
