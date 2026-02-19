import { DomainEvent } from "@domain/shared";
import { vi } from "vitest";
import { ServerEventDispatcher } from "./EventDispatcher";
import { BaseEventHandler } from "./eventHandler";

class FalkyHanlder extends BaseEventHandler {
  protected process(): Promise<void> | void {
    throw new Error("Falky Hanlder Process");
  }
}
class SpyHanlder extends BaseEventHandler {
  public spy: (event: DomainEvent) => void;
  constructor(spy: () => void) {
    super();
    this.spy = spy;
  }
  protected process(event: DomainEvent): Promise<void> | void {
    this.spy(event);
  }
}

class MockEvent extends DomainEvent {
  constructor() {
    super("MockEvent");
  }
  getAggregateId(): string {
    return "MockEvent";
  }
  toLog(): string {
    return "MockEvent";
  }
}

describe("Event Dispatcher Tests", () => {
  test("Should handle dispatched single event with one failing Handler", () => {
    const spyFn = vi.fn();
    const falkyHandler = new FalkyHanlder();
    const spyHanlder = new SpyHanlder(spyFn);

    const dispatcher = new ServerEventDispatcher([falkyHandler, spyHanlder]);

    dispatcher.dispatch(new MockEvent());

    expect(spyFn).toHaveBeenCalledTimes(1);
  });

  test("Should handle dispatched all events", () => {
    const spyFn = vi.fn();
    const spyHanlder = new SpyHanlder(spyFn);

    const dispatcher = new ServerEventDispatcher([spyHanlder]);

    dispatcher.dispatchAll([new MockEvent(), new MockEvent()]);

    expect(spyFn).toHaveBeenCalledTimes(2);
  });
});
