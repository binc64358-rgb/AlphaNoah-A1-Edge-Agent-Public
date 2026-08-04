import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { adaptActivationSnapshot } from "../features/activation/adapter/activationAdapter";
import type { ActivationDataSource } from "../features/activation";
import { mockActivationResponse } from "../features/activation/mock/mockActivationResponse";
import { adaptDigitalEmployeeCollection } from "../features/digital-employees/adapter/digitalEmployeeAdapter";
import type { DigitalEmployeeDataSource } from "../features/digital-employees";
import { adaptWorkspaceProjection } from "../features/runtime/adapter/workspaceProjectionAdapter";
import { adaptPulseProjection } from "../features/runtime/pulse/pulseProjection";
import type {
  PulseDataSource,
  WorkspaceDataSource,
} from "../features/runtime";
import {
  mockProviderRuntimeDataSource,
} from "../features/runtime/composition";
import {
  PREFERENCES_STORAGE_KEY,
} from "../preferences/preferences";
import { App } from "./App";

const eventId = "event_0123456789abcdef0123456789abcdef";
const event = {
  id: eventId,
  type: "device_not_shutdown",
  status: "PENDING_HUMAN_REVIEW",
  timestamp: "2026-07-30T10:35:00+08:00",
  severity: "HIGH",
  responsibility: {
    id: "equipment-maintenance",
    name: "Equipment Maintenance",
  },
} as const;
const employee = {
  id: "equipment-maintenance",
  name: "Equipment Maintenance Agent",
  status: "working",
  current_event_id: eventId,
  responsibility: "Equipment anomaly analysis",
  skills: [{ name: "Anomaly analysis" }],
} as const;
const pulse = {
  level: "attention",
  title: "Equipment exception requires review",
  event_id: eventId,
} as const;

describe("F03-D2 activation projection refresh", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    window.localStorage.clear();
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        locale: "en-US",
        theme: "dark",
        motion: "reduced",
      }),
    );
  });

  it("treats activation as a command and refreshes all three read projections", async () => {
    const harness = createProjectionHarness();
    const user = userEvent.setup();

    render(
      <App
        activationDataSource={harness.activation}
        digitalEmployeeDataSource={harness.employees}
        pulseDataSource={harness.pulse}
        providerRuntimeDataSource={mockProviderRuntimeDataSource}
        workspaceDataSource={harness.workspace}
      />,
    );

    expect(
      await screen.findByText(
        "No abnormal events are currently projected.",
      ),
    ).toBeInTheDocument();
    const trigger = screen.getByRole("button", {
      name: "Simulate equipment anomaly",
    });
    await user.click(trigger);

    await waitFor(() =>
      expect(trigger).toHaveTextContent("Employee activated"),
    );
    expect(
      await screen.findByRole("button", {
        name: "Open action context: device_not_shutdown",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Open Noah Pulse summary",
      }),
    ).toHaveTextContent("Equipment exception requires review");

    await user.click(
      screen.getByRole("link", { name: "Digital Employees" }),
    );
    expect(
      await screen.findByRole("link", {
        name: /Equipment Maintenance Agent.*Working/,
      }),
    ).toBeInTheDocument();

    expect(harness.calls).toEqual({
      workspace: 2,
      pulse: 2,
      employees: 2,
    });
  });
});

function createProjectionHarness() {
  let active = false;
  const calls = {
    workspace: 0,
    pulse: 0,
    employees: 0,
  };
  const emptyWorkspace = adaptWorkspaceProjection({
    version: "workspace-v1",
    events: [],
    active_event: null,
    pulse: null,
    employees: [],
  });
  const activeWorkspace = adaptWorkspaceProjection({
    version: "workspace-v1",
    events: [event],
    active_event: event,
    pulse,
    employees: [employee],
  });
  const emptyEmployees = adaptDigitalEmployeeCollection([]);
  const activeEmployees = adaptDigitalEmployeeCollection([employee]);
  const activePulse = adaptPulseProjection(pulse);
  const activationSnapshot = adaptActivationSnapshot(
    mockActivationResponse,
    "mock",
  );

  const workspace: WorkspaceDataSource = {
    source: "http",
    getInitialSnapshot: () => emptyWorkspace,
    getWorkspace: async () => {
      calls.workspace += 1;
      return active ? activeWorkspace : emptyWorkspace;
    },
  };
  const pulseSource: PulseDataSource = {
    source: "http",
    getInitialPulse: () => null,
    getPulse: async () => {
      calls.pulse += 1;
      return active ? activePulse : null;
    },
  };
  const employees: DigitalEmployeeDataSource = {
    source: "http",
    getInitialCollection: () => emptyEmployees,
    getEmployees: async () => {
      calls.employees += 1;
      return active ? activeEmployees : emptyEmployees;
    },
  };
  const activation: ActivationDataSource = {
    source: "mock",
    activate: async () => {
      active = true;
      return activationSnapshot;
    },
    getEvent: async () => activationSnapshot,
  };

  return {
    activation,
    workspace,
    pulse: pulseSource,
    employees,
    calls,
  };
}
