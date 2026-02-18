import { baseApi } from "./baseApi";

export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDestinations: builder.query({
      query: (params) => ({
        url: "/destinations/view-all/",
        method: "GET",
        params: { ...params },
        providesTags: ["Destinations"],
      }),
    }),
    getSingleDestination: builder.query({
      query: (id) => ({
        url: `/destinations/detail/${id}/`,
        method: "GET",
        id: { ...id },
        providesTags: ["Destinations"],
      }),
    }),
    getBookingFirstView: builder.query({
      query: (params) => ({
        url: `/bookings/view-all/`,
        method: "GET",
        params: { ...params },
        providesTags: ["Destinations"],
      }),
    }),
    getTourBookingFirstStep: builder.mutation({
      query: (params) => ({
        url: `/bookings/tour-bookings/`,
        method: "POST",
        body: { ...params },
        invalidatesTags: ["Destinations"],
      }),
    }),
  }),
});

export const {
  useGetAllDestinationsQuery,
  useGetSingleDestinationQuery,
  useGetBookingFirstViewQuery,
  useGetTourBookingFirstStepMutation,
} = destinationApi;
