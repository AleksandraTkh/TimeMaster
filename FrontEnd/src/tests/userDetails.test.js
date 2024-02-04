import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import UserDetailsPage from "../pages/userDetailsPage";

describe("UserDetailsPage", () => {
  beforeEach(() => {
    const currentUserId = "1";
    jest
      .spyOn(window.sessionStorage.__proto__, "getItem")
      .mockReturnValue(currentUserId);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          user_id: currentUserId,
          username: "TestUser",
          email: "test@example.com",
        }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("displays user details when logged in", async () => {
    render(
      <MemoryRouter>
        <UserDetailsPage />
      </MemoryRouter>
    );

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText("User Details")).toBeInTheDocument();
    });

    // Wait for the name to be present
    await waitFor(() => {
      expect(screen.getByText("Name:")).toBeInTheDocument();
    });

    // Wait for the email to be present
    await waitFor(() => {
      expect(screen.getByText("Email:")).toBeInTheDocument();
    });
  });
});
