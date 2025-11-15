import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Code, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const Interactive = () => {
  const [activeTab, setActiveTab] = useState<"quiz" | "editor">("quiz");
  const [selectedLanguage, setSelectedLanguage] = useState("html");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [code, setCode] = useState("");

  // Default code templates for each language
  const defaultCode: Record<string, string> = {
    html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <style>
    body { font-family: Arial; padding: 20px; background: linear-gradient(135deg, #0B3B24, #1a5c3a); color: white; }
    h1 { color: #CBA135; }
  </style>
</head>
<body>
  <h1>Welcome to GMU Coding Club!</h1>
  <p>Edit the code on the left to see changes here.</p>
</body>
</html>`,
    python: `# Python example
def greet(name):
    return f"Hello, {name}!"

print(greet("GMU"))`,
    java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Welcome to GMU Coding Club!");
  }
}`,
    c: `#include <stdio.h>

int main() {
    printf("Welcome to GMU Coding Club!\\n");
    return 0;
}`,
  };

  // Quiz questions per language
  const quizData: Record<string, Question[]> = {
    html: [
      { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"], correct: 0 },
      { id: 2, question: "Which tag is used to create a hyperlink in HTML?", options: ["<link>", "<a>", "<href>", "<url>"], correct: 1 },
      { id: 3, question: "What is the correct HTML element for inserting a line break?", options: ["<break>", "<lb>", "<br>", "<hr>"], correct: 2 },
      { id: 4, question: "Which HTML attribute is used to define inline styles?", options: ["font", "class", "style", "css"], correct: 2 },
      { id: 5, question: "Which tag is used to display an image in HTML?", options: ["<pic>", "<img>", "<src>", "<image>"], correct: 1 },
    ],
    python: [
      { id: 1, question: "Which keyword is used to define a function in Python?", options: ["function", "define", "def", "lambda"], correct: 2 },
      { id: 2, question: "What is the output of print(2 ** 3)?", options: ["6", "8", "9", "Error"], correct: 1 },
      { id: 3, question: "Which of the following is a mutable data type in Python?", options: ["tuple", "list", "string", "int"], correct: 1 },
      { id: 4, question: "What is the correct file extension for Python files?", options: [".pt", ".py", ".pyt", ".python"], correct: 1 },
      { id: 5, question: "Which function is used to get input from the user?", options: ["input()", "read()", "scan()", "get()"], correct: 0 },
    ],
    java: [
      { id: 1, question: "Which keyword is used to inherit a class in Java?", options: ["this", "super", "extends", "inherits"], correct: 2 },
      { id: 2, question: "Which method is the entry point for any Java program?", options: ["init()", "start()", "main()", "run()"], correct: 2 },
      { id: 3, question: "Which of the following is not a Java access modifier?", options: ["private", "protected", "public", "package"], correct: 3 },
      { id: 4, question: "Which symbol is used to end a statement in Java?", options: [".", ":", ";", ","], correct: 2 },
      { id: 5, question: "Which keyword is used to create an object in Java?", options: ["new", "create", "object", "instance"], correct: 0 },
    ],
    c: [
      { id: 1, question: "Which symbol is used to start a preprocessor directive in C?", options: ["$", "#", "&", "@"], correct: 1 },
      { id: 2, question: "Which of these is a correct comment in C?", options: ["// comment", "# comment", "<!-- comment -->", "** comment **"], correct: 0 },
      { id: 3, question: "Which data type is used to store a single character in C?", options: ["string", "char", "character", "text"], correct: 1 },
      { id: 4, question: "What is the default return type of main() in C?", options: ["void", "int", "float", "char"], correct: 1 },
      { id: 5, question: "Which header file is needed for printf()?", options: ["<conio.h>", "<stdlib.h>", "<stdio.h>", "<math.h>"], correct: 2 },
    ],
  };

  const quizQuestions = quizData[selectedLanguage];

  useEffect(() => {
    setCode(defaultCode[selectedLanguage]);
    resetQuiz();
  }, [selectedLanguage]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else setShowResults(true);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const calculateScore = () =>
    selectedAnswers.reduce(
      (score, answer, index) => score + (answer === quizQuestions[index].correct ? 1 : 0),
      0
    );

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const runCode = () => {
    toast.success("Code executed successfully!", {
      description: `Simulated ${selectedLanguage.toUpperCase()} output.`,
    });
  };

  return (
    <section id="interactive" className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive <span className="gradient-text">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge and experiment with code in real-time
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeTab === "quiz" ? "default" : "outline"}
            onClick={() => setActiveTab("quiz")}
            className="gap-2"
          >
            <Brain className="h-4 w-4" />
            Coding Quiz
          </Button>
          <Button
            variant={activeTab === "editor" ? "default" : "outline"}
            onClick={() => setActiveTab("editor")}
            className="gap-2"
          >
            <Code className="h-4 w-4" />
            Live Code Editor
          </Button>
        </div>

        {/* QUIZ SECTION */}
        {activeTab === "quiz" && (
          <div className="max-w-3xl mx-auto">
            {/* Language Selector */}
            <div className="flex justify-center mb-6">
              <select
                className="border rounded-md px-4 py-2 bg-background text-foreground shadow-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="c">C</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="html">HTML</option>
              </select>
            </div>

            {!showResults ? (
              <Card className="hover-lift">
                <CardHeader>
                  <div className="flex justify-between items-center mb-4">
                    <CardTitle>
                      {selectedLanguage.toUpperCase()} Quiz — Question {currentQuestion + 1} of{" "}
                      {quizQuestions.length}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Score: {selectedAnswers.filter((a, i) => a === quizQuestions[i].correct).length}/{quizQuestions.length}
                    </div>
                  </div>
                  <CardDescription className="text-lg font-medium text-foreground">
                    {quizQuestions[currentQuestion].question}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={selectedAnswers[currentQuestion]?.toString()}
                    onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  >
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted cursor-pointer">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                      Previous
                    </Button>
                    <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined}>
                      {currentQuestion === quizQuestions.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="hover-lift text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Trophy className="h-16 w-16 text-secondary" />
                  </div>
                  <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                  <CardDescription className="text-xl pt-4">
                    You scored <span className="text-secondary font-bold text-2xl">{calculateScore()}</span> out of {quizQuestions.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-muted-foreground">
                    {calculateScore() === quizQuestions.length && "Perfect score! You're a coding champion! 🎉"}
                    {calculateScore() >= quizQuestions.length * 0.7 &&
                      calculateScore() < quizQuestions.length &&
                      "Great job! Keep learning! 📚"}
                    {calculateScore() < quizQuestions.length * 0.7 &&
                      "Good effort! Practice makes perfect! 💪"}
                  </div>
                  <Button onClick={resetQuiz}>Retake Quiz</Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* CODE EDITOR SECTION */}
        {activeTab === "editor" && (
          <div className="max-w-6xl mx-auto">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Live {selectedLanguage.toUpperCase()} Editor</CardTitle>
                <CardDescription>
                  Write code on the left and see output or preview on the right
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">Code Editor</Label>
                      <Button size="sm" onClick={runCode} variant="secondary">
                        <Code className="h-4 w-4 mr-2" />
                        Run Code
                      </Button>
                    </div>
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="font-mono text-sm min-h-[400px] bg-muted"
                      placeholder={`Write your ${selectedLanguage.toUpperCase()} code here...`}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      {selectedLanguage === "html" ? "Live Preview" : "Output"}
                    </Label>
                    <div className="border rounded-lg overflow-hidden bg-white min-h-[400px] p-4">
                      {selectedLanguage === "html" ? (
                        <iframe
                          srcDoc={code}
                          title="Live Preview"
                          className="w-full h-[400px]"
                          sandbox="allow-scripts"
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm text-black">{`[Simulated ${selectedLanguage.toUpperCase()} Output]`}</pre>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Interactive;
