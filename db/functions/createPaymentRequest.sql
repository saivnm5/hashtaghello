CREATE OR REPLACE FUNCTION createPaymentRequest(
  storyId integer,
  amount numeric(12,2),
  buyerName text,
  requestId text,
  OUT paymentId integer)
AS $$
BEGIN
  INSERT INTO
  "payment" ("story", "amount", "buyerName", "instamojoRequestId")
  VALUES (storyId, amount, buyerName, requestId)
  returning "id" into paymentId;
END; $$
LANGUAGE plpgsql;