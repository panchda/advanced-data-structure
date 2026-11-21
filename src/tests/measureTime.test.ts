import { describe, expect, it, vi } from "vitest";
import { measureTime } from "../benchmarks/measureTime";

describe("measureTime", () => {
  it("should execute the provided operation exactly once", () => {
    const operation = vi.fn();

    measureTime(operation);

    expect(operation).toHaveBeenCalledOnce();
  });

  it("should return the elapsed time in milliseconds", () => {
    const nowSpy = vi
      .spyOn(performance, "now")
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(125);

    try {
      const duration = measureTime(() => {});

      expect(duration).toBe(25);
      expect(nowSpy).toHaveBeenCalledTimes(2);
    } finally {
      nowSpy.mockRestore();
    }
  });

  it("should propagate errors thrown by the operation", () => {
    const operation = () => {
      throw new Error("Operation failed");
    };

    expect(() => measureTime(operation)).toThrow("Operation failed");
  });
});
