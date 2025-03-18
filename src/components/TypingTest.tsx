import { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Container,
  Heading,
  useToken,
  Progress,
  Badge,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Circle,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import {
  FiRefreshCw,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiCode,
  FiDatabase,
  FiCpu,
  FiLayers,
  FiBox,
} from "react-icons/fi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionBadge = motion(Badge);
const MotionButton = motion(Button);
const MotionHeading = motion(Heading);
const MotionHStack = motion(HStack);

type LetterStatus = "untyped" | "correct" | "incorrect";

interface Letter {
  char: string;
  status: LetterStatus;
}

interface Word {
  text: string;
  status: LetterStatus;
  letters: Letter[];
}

interface Line {
  text: string;
  status: LetterStatus;
}

interface CodeSnippet {
  language: string;
  code: string;
  description: string;
  category: string;
  difficulty: number;
  explanation: string;
}

interface PerformanceData {
  timestamp: number;
  wpm: number;
  accuracy: number;
}

const CODE_SNIPPETS = [
  // Easy Problems
  {
    language: "Java",
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    description: "Two Sum (Easy)",
    category: "Arrays",
    difficulty: 1,
    explanation:
      "Uses a HashMap to store complements. For each number, checks if its complement (target - num) exists in the map. Time: O(n), Space: O(n).",
  },
  {
    language: "Java",
    code: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
}`,
    description: "Maximum Subarray (Easy)",
    category: "Arrays",
    difficulty: 1,
    explanation:
      "Uses Kadane's algorithm. At each step, decides whether to start a new subarray or extend the existing one. Time: O(n), Space: O(1).",
  },
  // Medium Problems
  {
    language: "Java",
    code: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        
        for (String str : strs) {
            char[] chars = str.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
        }
        
        return new ArrayList<>(map.values());
    }
}`,
    description: "Group Anagrams (Medium)",
    category: "Strings",
    difficulty: 2,
    explanation:
      "Groups strings by sorting each one to create a key. All anagrams will have the same sorted key. Time: O(n * k * log k), Space: O(n * k).",
  },
  {
    language: "Java",
    code: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        
        for (int num : nums) {
            heap.offer(num);
            if (heap.size() > k) {
                heap.poll();
            }
        }
        
        return heap.peek();
    }
}`,
    description: "Kth Largest Element (Medium)",
    category: "Heap",
    difficulty: 2,
    explanation:
      "Maintains a min-heap of size k. After processing all numbers, the top element is the kth largest. Time: O(n * log k), Space: O(k).",
  },
  // Hard Problems
  {
    language: "Java",
    code: `class Solution {
    public int largestRectangleArea(int[] heights) {
        Stack<Integer> stack = new Stack<>();
        int maxArea = 0;
        int i = 0;
        
        while (i < heights.length) {
            if (stack.isEmpty() || heights[stack.peek()] <= heights[i]) {
                stack.push(i++);
            } else {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
        }
        
        while (!stack.isEmpty()) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        
        return maxArea;
    }
}`,
    description: "Largest Rectangle in Histogram (Hard)",
    category: "Stack",
    difficulty: 3,
    explanation:
      "Uses a monotonic stack to track increasing heights. When a smaller height is found, calculates areas of rectangles that can be formed. Time: O(n), Space: O(n).",
  },
  {
    language: "Java",
    code: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j - 1],  // replace
                        Math.min(
                            dp[i - 1][j],   // delete
                            dp[i][j - 1]    // insert
                        )
                    );
                }
            }
        }
        return dp[m][n];
    }
}`,
    description: "Edit Distance (Hard)",
    category: "Dynamic Programming",
    difficulty: 3,
    explanation:
      "Uses dynamic programming to find minimum operations (insert, delete, replace) to convert one string to another. Time: O(mn), Space: O(mn).",
  },
];

export const TypingTest = () => {
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet>(
    CODE_SNIPPETS[0]
  );
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [lastKeyPressTime, setLastKeyPressTime] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [totalPauseTime, setTotalPauseTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [bestWpm, setBestWpm] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [mainColor] = useToken("colors", ["blue.500"]);

  useEffect(() => {
    if (input === currentSnippet.code && !isFinished) {
      const end = Date.now();
      setEndTime(end);
      setIsFinished(true);
      setShowModal(true);

      // Calculate final WPM and accuracy
      const timeInMinutes = (end - (startTime || 0)) / 60000;
      const wordsTyped = currentSnippet.code.length / 5;
      const finalWpm = Math.round(wordsTyped / timeInMinutes);
      const finalAccuracy = Math.max(
        0,
        Math.round(
          ((currentSnippet.code.length - errors) / currentSnippet.code.length) *
            100
        )
      );

      setWpm(finalWpm);
      setAccuracy(finalAccuracy);

      // Update performance history
      const newPerformanceData: PerformanceData = {
        timestamp: end,
        wpm: finalWpm,
        accuracy: finalAccuracy,
      };
      setPerformanceHistory((prev) => [...prev, newPerformanceData]);

      // Update best WPM
      if (finalWpm > bestWpm) {
        setBestWpm(finalWpm);
      }

      // Update streak
      if (finalAccuracy >= 95) {
        setCurrentStreak((prev) => {
          const newStreak = prev + 1;
          if (newStreak > bestStreak) {
            setBestStreak(newStreak);
          }
          return newStreak;
        });
      } else {
        setCurrentStreak(0);
      }
    }
  }, [input, currentSnippet.code, startTime, isFinished, errors, bestWpm, bestStreak]);

  useEffect(() => {
    const now = Date.now();
    if (isTyping && lastKeyPressTime && now - lastKeyPressTime > 2000) {
      setIsPaused(true);
      setPauseStartTime(now);
    }
  }, [isTyping, lastKeyPressTime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    if (!startTime && newInput.length === 1) {
      setStartTime(Date.now());
    }

    setInput(newInput);
    setIsTyping(true);
    setLastKeyPressTime(Date.now());

    if (isPaused) {
      setIsPaused(false);
      if (pauseStartTime) {
        setTotalPauseTime(
          (prev) => prev + (Date.now() - pauseStartTime)
        );
      }
      setPauseStartTime(null);
    }

    // Check for errors
    let newErrors = 0;
    for (let i = 0; i < newInput.length; i++) {
      if (newInput[i] !== currentSnippet.code[i]) {
        newErrors++;
      }
    }
    setErrors(newErrors);

    // Update current index
    setCurrentIndex(newInput.length);
  };

  const resetTest = () => {
    const randomIndex = Math.floor(Math.random() * CODE_SNIPPETS.length);
    setCurrentSnippet(CODE_SNIPPETS[randomIndex]);
    setInput("");
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setShowModal(false);
    setCurrentIndex(0);
    setErrors(0);
    setIsTyping(false);
    setIsPaused(false);
    setTotalPauseTime(0);
    setPauseStartTime(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getFilteredSnippets = () => {
    return CODE_SNIPPETS.filter((snippet) => {
      const difficultyMatch =
        difficultyFilter === null || snippet.difficulty === difficultyFilter;
      const categoryMatch =
        categoryFilter === null || snippet.category === categoryFilter;
      return difficultyMatch && categoryMatch;
    });
  };

  const selectSnippet = (snippet: CodeSnippet) => {
    setCurrentSnippet(snippet);
    resetTest();
  };

  const renderPerformanceGraph = () => {
    const data = {
      labels: performanceHistory.map((_, index) => `Test ${index + 1}`),
      datasets: [
        {
          label: "WPM",
          data: performanceHistory.map((perf) => perf.wpm),
          borderColor: mainColor,
          tension: 0.4,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  const calculateProgress = () => {
    return (currentIndex / currentSnippet.code.length) * 100;
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "green";
      case 2:
        return "yellow";
      case 3:
        return "red";
      default:
        return "gray";
    }
  };

  const renderDifficultyStars = (difficulty: number) => {
    return Array(difficulty)
      .fill(0)
      .map((_, index) => (
        <Icon
          key={index}
          as={FiAward}
          color={getDifficultyColor(difficulty)}
          w={4}
          h={4}
        />
      ));
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack>
            <Logo />
            <MotionHeading
              size="lg"
              bgGradient="linear(to-r, blue.400, purple.400)"
              bgClip="text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              TyperMaker20000
            </MotionHeading>
          </HStack>
          <HStack spacing={4}>
            <MotionBadge
              colorScheme="blue"
              variant="subtle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <HStack spacing={2}>
                <Icon as={FiTrendingUp} />
                <Text>Best: {bestWpm} WPM</Text>
              </HStack>
            </MotionBadge>
            <MotionBadge
              colorScheme="purple"
              variant="subtle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <HStack spacing={2}>
                <Icon as={FiZap} />
                <Text>Streak: {currentStreak}</Text>
              </HStack>
            </MotionBadge>
          </HStack>
        </HStack>

        {/* Code Snippet Info */}
        <Box
          p={6}
          borderRadius="lg"
          bg="whiteAlpha.50"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <HStack>
                <Icon as={FiCode} w={5} h={5} color="blue.400" />
                <Text fontSize="lg" fontWeight="bold">
                  {currentSnippet.description}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.400">
                  Difficulty:
                </Text>
                {renderDifficultyStars(currentSnippet.difficulty)}
              </HStack>
            </HStack>
            <HStack spacing={4}>
              <Badge colorScheme="blue" variant="subtle">
                {currentSnippet.language}
              </Badge>
              <Badge colorScheme="purple" variant="subtle">
                {currentSnippet.category}
              </Badge>
            </HStack>
          </VStack>
        </Box>

        {/* Typing Area */}
        <Box
          p={6}
          borderRadius="lg"
          bg="whiteAlpha.50"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.100"
          position="relative"
          overflow="hidden"
          className="matrix-rain"
        >
          <VStack spacing={4} align="stretch">
            {/* Code Display */}
            <Box
              fontFamily="mono"
              fontSize="md"
              p={4}
              borderRadius="md"
              bg="whiteAlpha.100"
              position="relative"
              overflow="hidden"
            >
              <Text whiteSpace="pre-wrap">
                {currentSnippet.code.split("").map((char, index) => (
                  <Text
                    key={index}
                    as="span"
                    color={
                      index < input.length
                        ? input[index] === char
                          ? "green.400"
                          : "red.400"
                        : "inherit"
                    }
                    bg={index === currentIndex ? "whiteAlpha.200" : "transparent"}
                    textDecoration={
                      index < input.length && input[index] !== char
                        ? "underline"
                        : "none"
                    }
                  >
                    {char}
                  </Text>
                ))}
              </Text>
            </Box>

            {/* Input Field */}
            <Input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Start typing..."
              size="lg"
              bg="whiteAlpha.200"
              border="none"
              _focus={{
                boxShadow: "none",
                bg: "whiteAlpha.300",
              }}
              disabled={isFinished}
              autoFocus
            />

            {/* Progress Bar */}
            <Progress
              value={calculateProgress()}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
              bg="whiteAlpha.100"
            />

            {/* Stats */}
            <SimpleGrid columns={4} spacing={4}>
              <Stat>
                <StatLabel>WPM</StatLabel>
                <StatNumber>{wpm}</StatNumber>
                {wpm > 0 && (
                  <StatHelpText>
                    <StatArrow type={wpm > bestWpm ? "increase" : "decrease"} />
                    {wpm > bestWpm ? "New Best!" : `Best: ${bestWpm}`}
                  </StatHelpText>
                )}
              </Stat>
              <Stat>
                <StatLabel>Accuracy</StatLabel>
                <StatNumber>{accuracy}%</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Errors</StatLabel>
                <StatNumber>{errors}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Progress</StatLabel>
                <StatNumber>{Math.round(calculateProgress())}%</StatNumber>
              </Stat>
            </SimpleGrid>

            {/* Reset Button */}
            <HStack justify="center">
              <MotionButton
                leftIcon={<FiRefreshCw />}
                onClick={resetTest}
                colorScheme="blue"
                size="lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Test
              </MotionButton>
            </HStack>
          </VStack>
        </Box>

        {/* Results Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent
            bg="gray.800"
            borderRadius="xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <ModalHeader>Test Results</ModalHeader>
            <ModalBody>
              <VStack spacing={6}>
                <SimpleGrid columns={2} spacing={4} width="100%">
                  <Box
                    p={4}
                    borderRadius="lg"
                    bg="whiteAlpha.100"
                    textAlign="center"
                  >
                    <Text fontSize="sm" color="gray.400">
                      WPM
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.400">
                      {wpm}
                    </Text>
                  </Box>
                  <Box
                    p={4}
                    borderRadius="lg"
                    bg="whiteAlpha.100"
                    textAlign="center"
                  >
                    <Text fontSize="sm" color="gray.400">
                      Accuracy
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="green.400">
                      {accuracy}%
                    </Text>
                  </Box>
                </SimpleGrid>

                <Box w="100%" h="200px">
                  {renderPerformanceGraph()}
                </Box>

                <Text fontSize="sm" color="gray.400" textAlign="center">
                  {currentSnippet.explanation}
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={resetTest}>
                Try Again
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Snippet Selection */}
        <Box
          p={6}
          borderRadius="lg"
          bg="whiteAlpha.50"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                Available Snippets
              </Text>
              <HStack spacing={4}>
                <Select
                  value={difficultyFilter || ""}
                  onChange={(e) =>
                    setDifficultyFilter(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder="Difficulty"
                  size="sm"
                  width="150px"
                >
                  <option value="1">Easy</option>
                  <option value="2">Medium</option>
                  <option value="3">Hard</option>
                </Select>
                <Select
                  value={categoryFilter || ""}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value || null)
                  }
                  placeholder="Category"
                  size="sm"
                  width="150px"
                >
                  {Array.from(
                    new Set(CODE_SNIPPETS.map((s) => s.category))
                  ).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </HStack>
            </HStack>
            <SimpleGrid columns={2} spacing={4}>
              {getFilteredSnippets().map((snippet, index) => (
                <Box
                  key={index}
                  p={4}
                  borderRadius="md"
                  bg="whiteAlpha.100"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ bg: "whiteAlpha.200" }}
                  onClick={() => selectSnippet(snippet)}
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{snippet.description}</Text>
                      <HStack>
                        <Badge colorScheme="blue" variant="subtle">
                          {snippet.language}
                        </Badge>
                        <Badge colorScheme="purple" variant="subtle">
                          {snippet.category}
                        </Badge>
                      </HStack>
                    </VStack>
                    <HStack>{renderDifficultyStars(snippet.difficulty)}</HStack>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};