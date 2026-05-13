# Image Feedback Example

This example demonstrates the first target loop:

1. Render an `ImageFeedbackPanel` from artifact state.
2. Capture a user box annotation and text feedback.
3. Convert the feedback into `agent.feedback.v1`.
4. Apply an `artifact.patch.v1` update.
5. Replay the event log.
