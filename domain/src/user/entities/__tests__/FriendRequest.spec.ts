import { describe, it, expect, beforeEach } from "vitest";
import { FriendRequest } from "../FriendRequest";
import * as uuid from "uuid";
import { RequestStatus } from "../../types/RequestStatus";
import {
  FriendRequestSentEvent,
  FriendRequestApprovedEvent,
  FriendRequestRejectedEvent,
} from "../../events/FriendRequestEvents";
import { generateId, type UUID } from "../../../shared/Uuid";

describe("FriendRequest", () => {
  let requestId: UUID;
  let senderId: UUID;
  let receiverId: UUID;

  beforeEach(() => {
    requestId = uuid.stringify(
      uuid.parse("acc4a4ab-eafb-4d7d-84c3-d92844e63475"),
    );
    senderId = uuid.stringify(
      uuid.parse("a9404e77-befb-4c57-bb32-38490aa2eeb3"),
    );
    receiverId = uuid.stringify(
      uuid.parse("4d10b756-6dd4-45d1-b37f-40c6cc925162"),
    );
  });

  describe("constructor", () => {
    it("should create a friend request with provided values", () => {
      const friendRequest = new FriendRequest(requestId, senderId, receiverId);

      expect(friendRequest.id).toBe(requestId);
      expect(friendRequest.senderId).toBe(senderId);
      expect(friendRequest.receiverId).toBe(receiverId);
      expect(friendRequest.status).toBe(RequestStatus.PENDING);
      expect(friendRequest.createdAt).toBeInstanceOf(Date);
      expect(friendRequest.updatedAt).toBeInstanceOf(Date);
    });

    it("should create a friend request with custom status and dates", () => {
      const createdAt = new Date("2023-01-01");
      const updatedAt = new Date("2023-01-02");
      const expiresAt = new Date("2023-02-01");

      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.APPROVED,
        createdAt,
        updatedAt,
        expiresAt,
      );

      expect(friendRequest.status).toBe(RequestStatus.APPROVED);
      expect(friendRequest.createdAt).toBe(createdAt);
      expect(friendRequest.updatedAt).toBe(updatedAt);
      expect(friendRequest.expiresAt).toBe(expiresAt);
    });

    it("should throw error when sender and receiver are the same", () => {
      expect(() => new FriendRequest(requestId, senderId, senderId)).toThrow(
        "Cannot send friend request to yourself",
      );
    });

    it("should raise FriendRequestSentEvent for new pending requests", () => {
      const friendRequest = new FriendRequest(requestId, senderId, receiverId);

      const events = friendRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FriendRequestSentEvent);
      expect((events[0] as FriendRequestSentEvent).requestId).toBe(requestId);
    });

    it("should not raise FriendRequestSentEvent for reconstituted requests", () => {
      const createdAt = new Date("2023-01-01");
      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.PENDING,
        createdAt,
      );

      expect(friendRequest.domainEvents).toHaveLength(0);
    });
  });

  describe("approve", () => {
    it("should approve a pending friend request", () => {
      const friendRequest = new FriendRequest(requestId, senderId, receiverId);
      friendRequest.clearDomainEvents(); // Clear creation event

      friendRequest.approve();

      expect(friendRequest.status).toBe(RequestStatus.APPROVED);

      const events = friendRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FriendRequestApprovedEvent);
    });

    it("should throw error when approving non-pending request", () => {
      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.APPROVED,
      );

      expect(() => friendRequest.approve()).toThrow(
        "Can only approve pending friend requests",
      );
    });

    it("should throw error when approving expired request", () => {
      const expiredDate = new Date(Date.now() - 1000); // 1 second ago
      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.PENDING,
        undefined,
        undefined,
        expiredDate,
      );

      expect(() => friendRequest.approve()).toThrow(
        "Cannot approve expired friend request",
      );
    });
  });

  describe("reject", () => {
    it("should reject a pending friend request", () => {
      const friendRequest = new FriendRequest(requestId, senderId, receiverId);
      friendRequest.clearDomainEvents(); // Clear creation event

      friendRequest.reject();

      expect(friendRequest.status).toBe(RequestStatus.REJECTED);

      const events = friendRequest.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FriendRequestRejectedEvent);
    });

    it("should throw error when rejecting non-pending request", () => {
      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.REJECTED,
      );

      expect(() => friendRequest.reject()).toThrow(
        "Can only reject pending friend requests",
      );
    });
  });

  describe("cancel", () => {
    it("should cancel a pending friend request", () => {
      const friendRequest = new FriendRequest(requestId, senderId, receiverId);

      friendRequest.cancel();

      expect(friendRequest.status).toBe(RequestStatus.CANCELLED);
    });

    it("should throw error when cancelling non-pending request", () => {
      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.APPROVED,
      );

      expect(() => friendRequest.cancel()).toThrow(
        "Can only cancel pending friend requests",
      );
    });
  });

  describe("expire", () => {
    it("should expire a pending friend request", () => {
      const friendRequest = new FriendRequest(requestId, senderId, receiverId);

      friendRequest.expire();

      expect(friendRequest.status).toBe(RequestStatus.EXPIRED);
    });

    it("should throw error when expiring non-pending request", () => {
      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.APPROVED,
      );

      expect(() => friendRequest.expire()).toThrow(
        "Can only expire pending friend requests",
      );
    });
  });

  describe("expiration logic", () => {
    it("should detect expired requests based on expiration date", () => {
      const expiredDate = new Date(Date.now() - 1000); // 1 second ago
      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.PENDING,
        undefined,
        undefined,
        expiredDate,
      );

      expect(friendRequest.isExpired()).toBe(true);
      expect(friendRequest.status).toBe(RequestStatus.EXPIRED);
    });

    it("should not detect non-expired requests as expired", () => {
      const futureDate = new Date(Date.now() + 86400000); // 1 day from now
      const friendRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.PENDING,
        undefined,
        undefined,
        futureDate,
      );

      expect(friendRequest.isExpired()).toBe(false);
    });
  });

  describe("status checks", () => {
    it("should correctly identify pending requests", () => {
      const friendRequest = new FriendRequest(requestId, senderId, receiverId);

      expect(friendRequest.isPending()).toBe(true);
      expect(friendRequest.isApproved()).toBe(false);
      expect(friendRequest.isRejected()).toBe(false);
      expect(friendRequest.isCancelled()).toBe(false);
    });

    it("should correctly identify final states", () => {
      const approvedRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.APPROVED,
      );
      const rejectedRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.REJECTED,
      );

      expect(approvedRequest.isFinal()).toBe(true);
      expect(rejectedRequest.isFinal()).toBe(true);
    });

    it("should correctly identify modifiable requests", () => {
      const pendingRequest = new FriendRequest(requestId, senderId, receiverId);
      const approvedRequest = new FriendRequest(
        requestId,
        senderId,
        receiverId,
        RequestStatus.APPROVED,
      );

      expect(pendingRequest.canBeModified()).toBe(true);
      expect(approvedRequest.canBeModified()).toBe(false);
    });
  });

  describe("factory methods", () => {
    describe("create", () => {
      it("should create a new friend request with generated ID and expiration", () => {
        const friendRequest = FriendRequest.create(senderId, receiverId);

        expect(friendRequest.senderId).toBe(senderId);
        expect(friendRequest.receiverId).toBe(receiverId);
        expect(friendRequest.status).toBe(RequestStatus.PENDING);
        // expect(friendRequest.id).toMatch(/^req_/);
        expect(friendRequest.expiresAt).toBeInstanceOf(Date);
      });

      it("should create a friend request with custom expiration days", () => {
        const friendRequest = FriendRequest.create(senderId, receiverId, 7);
        const expectedExpiration = new Date();
        expectedExpiration.setDate(expectedExpiration.getDate() + 7);

        expect(friendRequest.expiresAt!.getDate()).toBe(
          expectedExpiration.getDate(),
        );
      });
    });

    describe("reconstitute", () => {
      it("should reconstitute a friend request from persistence data", () => {
        const createdAt = new Date("2023-01-01");
        const updatedAt = new Date("2023-01-02");
        const expiresAt = new Date("2023-02-01");

        const friendRequest = FriendRequest.reconstitute(
          requestId,
          senderId,
          receiverId,
          RequestStatus.APPROVED,
          createdAt,
          updatedAt,
          expiresAt,
        );

        expect(friendRequest.id).toBe(requestId);
        expect(friendRequest.status).toBe(RequestStatus.APPROVED);
        expect(friendRequest.createdAt).toBe(createdAt);
        expect(friendRequest.updatedAt).toBe(updatedAt);
        expect(friendRequest.expiresAt).toBe(expiresAt);
        expect(friendRequest.domainEvents).toHaveLength(0);
      });
    });
  });

  describe("equality", () => {
    it("should be equal to requests with same ID", () => {
      const request1 = new FriendRequest(requestId, senderId, receiverId);
      const request2 = new FriendRequest(requestId, generateId(), generateId());

      expect(request1.equals(request2)).toBe(true);
    });

    it("should not be equal to requests with different ID", () => {
      const request1 = new FriendRequest(requestId, senderId, receiverId);
      const request2 = new FriendRequest(generateId(), senderId, receiverId);

      expect(request1.equals(request2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      const friendRequest = new FriendRequest(requestId, senderId, receiverId);

      expect(friendRequest.toString()).toBe(
        `FriendRequest(${friendRequest.id}, ${senderId} -> ${receiverId}, pending)`,
      );
    });
  });
});
