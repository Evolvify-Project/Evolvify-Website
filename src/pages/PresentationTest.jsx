import EvolviSense from "./EvolviSense";

const presentationTopics = [
  "Introduce Your Topic.",
  "Explain Your Key Points.",
  "Discuss Potential Challenges.",
  "Share Your Solution or Approach.",
  "Conclude with Your Vision.",
];

const TOPIC_DURATION = 30;

const PresentationTestPage = () => (
  <EvolviSense
    prompts={presentationTopics}
    testTypeLabel="Presentation"
    testTypeHeading="Presentation Test"
    promptLabel="Topic"
    promptSingular="Topic"
    durationPerPrompt={TOPIC_DURATION}
  />
);

export default PresentationTestPage;
