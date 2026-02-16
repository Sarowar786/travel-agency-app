import { baseApi } from "./baseApi";

export const destinationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDestinations: builder.query({
            query: (params) => ({
            url: "/destinations/view-all/",
            method: "GET",
            params:{...params},
            providesTags: ["Destinations"],
        }),
    }),
    getSingleDestination: builder.query({
        query: (id) => ({
            url: `/destinations/details/${id}/`,
            method: "GET",
            providesTags: ["Destinations"],
        }),
    }),


    }),
});


export const {
    useGetAllDestinationsQuery,
    useGetSingleDestinationQuery,
} = destinationApi