import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TravelPackage,
  BookPackageResponse,
  CreatePackageRequest,
} from "../types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const packagesApi = createApi({
  reducerPath: "packagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Packages"],
  endpoints: (builder) => ({
    getPackages: builder.query<TravelPackage[], void>({
      query: () => "/packages",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Packages" as const,
                id: _id,
              })),
              { type: "Packages", id: "LIST" },
            ]
          : [{ type: "Packages", id: "LIST" }],
    }),
    getPackageById: builder.query<TravelPackage, string>({
      query: (id) => `/packages/${id}`,
      providesTags: (result, error, id) => [{ type: "Packages", id }],
    }),
    bookPackage: builder.mutation<BookPackageResponse, string>({
      query: (id) => ({
        url: `/packages/${id}/book`,
        method: "POST",
      }),
      // Optimistic update for instant UI feedback + cache rollback on failure
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          packagesApi.util.updateQueryData(
            "getPackages",
            undefined,
            (draft) => {
              const pkg = draft.find((p) => p._id === id);
              if (pkg && pkg.availableSlots > 0) {
                pkg.availableSlots -= 1;
              }
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          // Ensure exact sync with backend response
          if (data?.package) {
            dispatch(
              packagesApi.util.updateQueryData(
                "getPackages",
                undefined,
                (draft) => {
                  const pkg = draft.find((p) => p._id === id);
                  if (pkg) {
                    pkg.availableSlots = data.package.availableSlots;
                  }
                },
              ),
            );
          }
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: "Packages", id },
        { type: "Packages", id: "LIST" },
      ],
    }),
    createPackage: builder.mutation<TravelPackage, CreatePackageRequest>({
      query: (newPackage) => ({
        url: "/packages",
        method: "POST",
        body: newPackage,
      }),
      invalidatesTags: [{ type: "Packages", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useGetPackageByIdQuery,
  useBookPackageMutation,
  useCreatePackageMutation,
} = packagesApi;
