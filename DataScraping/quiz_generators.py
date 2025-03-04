import openai
import json
import time
from dotenv import load_dotenv
import os
from concurrent.futures import ThreadPoolExecutor, as_completed



# Initialize OpenAI client with hardcoded API key
API_KEY = "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"  # Revoked API key
print(f"Using API Key: {API_KEY[:8]}...{API_KEY[-4:]}")  # Print partial key for security
client = openai.OpenAI(api_key=API_KEY)

# Define the prompts for each test. These should be the final, tailored prompts.
# (For brevity, only ADHD prompt is shown fully; you can fill in the others similarly.)
test_prompts = {
    "ADHD": r'''
You are a research expert in psychological assessment and test design. Your task is to perform a deep search of the academic literature and reputable mental health resources to identify the most widely used, scientifically validated ADHD screening instruments. Specifically, please focus on instruments such as:
- The Conners' Adult ADHD Rating Scales (CAARS)
- The ADHD Rating Scale IV (ADHD-RS-IV)
- The WHO Adult ADHD Self-Report Scale (ASRS)
- The Vanderbilt ADHD Diagnostic Rating Scale
- Other peer-reviewed or clinically validated tools

For each instrument, extract and clearly document the following core components:
1. Test Structure:
   - Total number of items/questions
   - Item format (e.g., 5-point Likert scale, multiple-choice)
   - Theoretical domains or symptom clusters (e.g., Inattention, Hyperactivity, Impulsivity)
   - Any special items (e.g., reverse-scored items, validity checks)

2. Question Design:
   - The style and phrasing of the questions (avoid overly direct DSM-5 language; instead, look for behavioral exemplars)
   - Temporal framing (e.g., "in the past 6 months," "during the past week")
   - Contextual and ecological anchors (e.g., work, school, home scenarios)

3. Scoring System:
   - How each response is scored (numeric values for each option)
   - Cutoff thresholds or criteria for symptom severity
   - How the instrument deals with response inconsistencies (e.g., using an inconsistency index)

4. Unique Features and Psychometric Enhancements:
   - How cross-informant data or performance measures are integrated
   - Any innovative aspects (e.g., dynamic item rotation, differential item functioning)

Using the synthesized information from the above components, please now generate a detailed prompt for a large language model (LLM) to create a custom ADHD screening quiz with the following specifications:
- The quiz must have exactly 20 questions.
- It should use a 5-point Likert scale for responses, where:
  - 0 = Never
  - 1 = Rarely
  - 2 = Sometimes
  - 3 = Often
  - 4 = Very Often
- The items should be distributed to assess:
  - 12 questions focused on Inattention (e.g., "When engaged in a long task, how often do you find your mind wandering?")
  - 6 questions focused on Hyperactivity/Impulsivity (e.g., "During meetings, how frequently do you feel restless or fidgety?")
- At least 2 items should serve as validity checks (with reverse scoring) to flag potential response biases.
- The prompt should instruct the LLM to generate unique, nuanced questions that avoid overly simplistic or obvious phrasing, and each question must include subtle behavioral examples and temporal markers.
- In addition, include instructions for generating a scoring guide: detail how to interpret raw scores (e.g., low, moderate, or high risk of ADHD symptoms) and suggest possible clinical recommendations based on the score ranges.
- The final output must be valid JSON with the following structure:

{
  "metadata": {
    "assessment_type": "Adult ADHD Screener",
    "version": "1.0",
    "normative_data": "Based on current evidence from validated ADHD assessment studies"
  },
  "items": [
    {
      "id": "IA01",
      "text": "Question text here...",
      "domain": "Inattention",
      "reverse_scored": false,
      "options": ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
      "optionValues": [0, 1, 2, 3, 4]
    },
    // ... remaining 19 questions
  ],
  "scoring": {
    "symptom_cutoffs": {
      "inattention": 6,
      "hyperactivity": 4
    },
    "interpretation": [
      {
        "range": [0, 10],
        "result": "Low likelihood of ADHD",
        "recommendation": "Your responses suggest minimal ADHD symptoms."
      },
      {
        "range": [11, 20],
        "result": "Moderate likelihood of ADHD",
        "recommendation": "Your responses indicate moderate symptoms; consider professional evaluation."
      },
      {
        "range": [21, 40],
        "result": "High likelihood of ADHD",
        "recommendation": "Your responses suggest significant ADHD symptoms; we recommend seeking a clinical assessment."
      }
    ]
  }
}

Please produce only the final JSON prompt (without additional commentary) that can be fed to an LLM to generate the desired ADHD quiz.
''',
    "Anxiety": r'''
You are a world-class clinical psychologist and expert in test development, specializing in anxiety assessment. Your task is to generate a custom, evidence-based anxiety screening instrument that is both scientifically rigorous and professionally designed. Please produce a JSON structure for a 20-question anxiety quiz with the following specifications:
1. Test Structure:
   - The instrument must contain exactly 20 items.
   - Each item must be a multiple-choice question with 5 answer options, combining descriptive phrases with numeric values:
       • 0: "Not at all"
       • 1: "Rarely"
       • 2: "Sometimes"
       • 3: "Often"
       • 4: "Nearly every day"
   - Distribute items to cover core anxiety symptoms (e.g., excessive worry, restlessness, irritability, muscle tension, sleep disturbances) and include at least 2 validity check items (with reverse-scored wording).
2. Question Design Requirements:
   - Questions must be phrased subtly and avoid overly simplistic answers, incorporating temporal markers (e.g., "Over the past two weeks...") and situational contexts (e.g., "at work," "in social situations").
   - Use behaviorally anchored language without verbatim DSM-5 phrasing.
3. Scoring System:
   - Provide a scoring algorithm that maps responses to a raw score and interprets the score into performance tiers (low, moderate, high anxiety).
   - Include clear interpretative recommendations for each tier.
4. Output Formatting:
   - The final output must be valid JSON structured as follows:

{
  "metadata": {
    "assessment_type": "Adult Anxiety Screener",
    "version": "1.0",
    "normative_data": "Based on current evidence from validated anxiety assessment studies"
  },
  "items": [
    {
      "id": "ANX01",
      "text": "Question text here...",
      "domain": "Core Anxiety",
      "reverse_scored": false,
      "options": [
         {"text": "Not at all", "value": 0},
         {"text": "Rarely", "value": 1},
         {"text": "Sometimes", "value": 2},
         {"text": "Often", "value": 3},
         {"text": "Nearly every day", "value": 4}
      ]
    }
    // ... total 20 questions with unique, behaviorally anchored text
  ],
  "scoring": {
    "symptom_cutoffs": {
      "core_anxiety": 10,
      "validity": 2
    },
    "interpretation": [
      {
        "range": [0, 10],
        "result": "Low anxiety",
        "recommendation": "Your responses indicate minimal anxiety symptoms."
      },
      {
        "range": [11, 20],
        "result": "Moderate anxiety",
        "recommendation": "Your responses suggest moderate anxiety; consider monitoring your symptoms and seeking guidance if they worsen."
      },
      {
        "range": [21, 40],
        "result": "High anxiety",
        "recommendation": "Your responses indicate high anxiety levels; a professional evaluation is recommended."
      }
    ]
  }
}

Generate only the final JSON prompt (without additional commentary) for producing this 20-question anxiety quiz.
''',
    "Emotional Intelligence": r'''
You are a world-class clinical psychologist and expert in test development specializing in Emotional Intelligence (EI). Your task is to create a custom, evidence-based EI screening instrument that adheres to current best practices in psychological assessment. Please produce a complete JSON structure for a 20-item Emotional Intelligence quiz with the following specifications:
1. Test Structure:
   - The instrument must contain exactly 20 unique items.
   - Items should cover core EI domains (e.g., Emotion Perception, Emotion Utilization, Emotion Understanding, Emotion Regulation) based on a hybrid model.
   - Each item must be multiple-choice with 5 answer options that combine descriptive phrases with numeric values (e.g., "Never – 0", "Rarely – 1", "Sometimes – 2", "Often – 3", "Nearly every day – 4").
   - Include at least 2 validity check items (reverse-scored) to detect response biases.
2. Question Design Requirements:
   - Each question must be contextually rich, behaviorally anchored, and include realistic scenarios and temporal markers.
   - Avoid overly simplistic phrasing and repetitive patterns; each question must be uniquely constructed.
3. Scoring System:
   - Provide a scoring algorithm that aggregates responses to yield a total EI score.
   - Define cutoff ranges that categorize EI as low, moderate, or high, along with interpretative recommendations.
4. Output Formatting:
   - The final output must be valid JSON structured as follows:

{
  "metadata": {
    "assessment_type": "Adult Emotional Intelligence Screener",
    "version": "1.0",
    "normative_data": "Based on current evidence from validated EI assessments and large-scale studies"
  },
  "items": [
    {
      "id": "EI01",
      "text": "Question text here...",
      "domain": "Emotion Perception",
      "reverse_scored": false,
      "options": [
         {"text": "Never experienced this in real-life situations (0)", "value": 0},
         {"text": "Rarely experienced this in everyday contexts (1)", "value": 1},
         {"text": "Sometimes encountered under stress or calm (2)", "value": 2},
         {"text": "Often noticed in both personal and professional settings (3)", "value": 3},
         {"text": "Nearly always apparent regardless of circumstances (4)", "value": 4}
      ]
    },
    // ... total 20 uniquely crafted items
  ],
  "scoring": {
    "symptom_cutoffs": {
      "emotion_competency": 12
    },
    "interpretation": [
      {
        "range": [0, 20],
        "result": "Low Emotional Intelligence",
        "recommendation": "Your responses indicate challenges in emotional awareness and regulation. Consider interventions focused on emotional skills training."
      },
      {
        "range": [21, 35],
        "result": "Moderate Emotional Intelligence",
        "recommendation": "Your emotional skills are average. Enhancing your emotional awareness and communication may further improve your relationships."
      },
      {
        "range": [36, 60],
        "result": "High Emotional Intelligence",
        "recommendation": "Your responses suggest strong emotional competencies. Continue to develop these skills and consider leadership roles that leverage your emotional insight."
      }
    ]
  }
}

Generate only the final JSON prompt (without additional commentary) that will instruct a language model to produce this complete 20-item Emotional Intelligence quiz.
''',
    "Temperament": r'''
You are a professional psychologist and expert test designer with extensive experience in evidence-based temperament assessment. Your task is to generate a scientifically rigorous, 20-question Temperament Type Quiz that is both clinically valid and professionally structured. The quiz should assess multiple dimensions of temperament (such as Sociability, Plasticity, Novelty Seeking, and Emotional Reactivity) based on established models (e.g., the Four Temperaments, MBTI variants, or similar frameworks). Please adhere strictly to the following specifications:
1. Test Structure:
   - The quiz must contain exactly 20 unique questions.
   - Each question should be designed to capture nuanced behavioral information and reflect real-world temperament traits.
   - Use a 5-point response scale that combines both descriptive phrases and numeric values (e.g., "I never initiate conversations (0)", "I rarely initiate conversations (1)", etc.).
   - The questions should cover different domains of temperament (e.g., Sociability, Plasticity, Novelty Seeking, Emotional Reactivity) with a balanced distribution.
   - Include at least 2 validity check items (reverse-scored) to identify inconsistent responses.
2. Question Design Requirements:
   - Language must be professional, nuanced, and avoid overly simplistic phrasing.
   - Incorporate contextual and behavioral exemplars (e.g., "During group interactions, how often do you take the initiative to start conversations?") with temporal markers and situational context.
   - Each question must be uniquely phrased with varied sentence structures.
3. Scoring System:
   - Each answer option must have an associated numeric value (0 to 4) alongside its descriptive text.
   - Provide a scoring algorithm that aggregates responses by domain, specifying cutoffs for dimensions such as Sociability, Plasticity, Novelty Seeking, and Emotional Reactivity.
   - Include an interpretation section mapping raw score ranges to qualitative outcomes (e.g., "Balanced Temperament", "High Emotional Reactivity", "Elevated Impulsivity") and recommendations.
4. Output Formatting:
   - The final output must be valid JSON structured as follows:

{
  "metadata": {
    "assessment_type": "Temperament Type Quiz",
    "version": "1.0",
    "normative_data": "Based on validated temperament assessment research and clinical data"
  },
  "items": [
    {
      "id": "T01",
      "text": "In social settings, how frequently do you initiate conversations even when you feel uncertain?",
      "domain": "Sociability",
      "reverse_scored": false,
      "options": [
         { "text": "I never initiate conversations (0)", "value": 0 },
         { "text": "I rarely initiate conversations (1)", "value": 1 },
         { "text": "I sometimes initiate conversations (2)", "value": 2 },
         { "text": "I often initiate conversations (3)", "value": 3 },
         { "text": "I always take the lead in starting conversations (4)", "value": 4 }
      ]
    },
    // ... Add the remaining 19 questions ensuring each is uniquely phrased and covers various temperament domains.
  ],
  "scoring": {
    "dimension_cutoffs": {
      "sociability": 7,
      "plasticity": 5,
      "novelty_seeking": 6,
      "emotional_reactivity": 4
    },
    "interpretation": [
      {
        "range": [0, 10],
        "result": "Balanced Temperament",
        "recommendation": "Your responses indicate a well-balanced temperament with adaptive behavioral traits."
      },
      {
        "range": [11, 20],
        "result": "High Emotional Reactivity",
        "recommendation": "Your responses suggest elevated emotional sensitivity. Consider strategies for emotion regulation and further assessment if needed."
      },
      {
        "range": [21, 40],
        "result": "Elevated Impulsivity",
        "recommendation": "Your responses indicate a high degree of impulsivity. It may be beneficial to explore behavioral interventions and seek professional evaluation."
      }
    ]
  }
}

Generate only the final JSON prompt (without additional commentary) that will instruct a language model to produce this 20-question Temperament Type Quiz with all specified components.
''',
    "IQ": r'''
You are a renowned psychometrician and test design expert specializing in cognitive assessments. Your task is to generate a scientifically rigorous and professionally structured 40-question IQ Test that is both challenging and engaging. This test should be based on established principles from standardized IQ tests (such as the Wechsler Adult Intelligence Scale, Stanford-Binet, and Raven's Progressive Matrices) but must also feature novel, nuanced, and original question phrasing.
Requirements:
1. Test Structure:
   - The quiz must contain exactly 40 unique questions covering diverse cognitive domains including Logical Reasoning, Numerical Reasoning, Spatial Visualization, Verbal Comprehension, Pattern Recognition, Analogical Reasoning, Sequence Identification, and Problem Solving.
   - Each question must be multiple-choice with answer options presented as descriptive phrases paired with numeric values. For example, instead of offering only numbers (0, 1, 2, 3, 4), each option should be a complete phrase such as "Option A: The pattern doubles each time (0)".
   - Questions must be uniquely phrased with varied sentence structures and incorporate real-world scenarios or abstract puzzles.
   - Include at least 2 validity check items (reverse-scored) to detect response inconsistencies.
2. Answer Options:
   - Provide 4 or 5 answer options per question, each with both descriptive text and an associated numeric value reflecting its correctness or alignment with cognitive ability.
   - Ensure distractor options are plausible and require careful consideration.
3. Scoring System:
   - Specify a scoring algorithm that assigns points based on the chosen options.
   - Provide clear cutoffs and performance tiers (e.g., "Below Average," "Average," "Above Average," "Superior") based on the aggregate raw score.
   - Include recommendations for each performance tier.
   - The scoring system should be evidence-based and may include notes on any reverse scoring for validity checks.
4. Output Formatting:
   - The final output must be valid JSON structured exactly as follows:

{
  "metadata": {
    "assessment_type": "IQ Test",
    "version": "1.0",
    "normative_data": "Based on standardized cognitive assessment research and established IQ test benchmarks"
  },
  "items": [
    {
      "id": "IQ01",
      "text": "Question text here...",
      "domain": "Logical Reasoning",
      "reverse_scored": false,
      "options": [
         { "text": "Option A: [Descriptive answer option]", "value": 0 },
         { "text": "Option B: [Descriptive answer option]", "value": 1 },
         { "text": "Option C: [Descriptive answer option]", "value": 2 },
         { "text": "Option D: [Descriptive answer option]", "value": 3 },
         { "text": "Option E: [Descriptive answer option]", "value": 4 }
      ]
    },
    // ... remaining 39 questions, ensuring each is distinct and covers various cognitive domains
  ],
  "scoring": {
    "raw_score_ranges": {
      "below_average": [0, 20],
      "average": [21, 30],
      "above_average": [31, 35],
      "superior": [36, 40]
    },
    "interpretation": [
      {
        "range": [0, 20],
        "result": "Below Average IQ",
        "recommendation": "Your responses suggest below-average cognitive performance; further evaluation may be beneficial."
      },
      {
        "range": [21, 30],
        "result": "Average IQ",
        "recommendation": "Your responses indicate average cognitive abilities; additional testing may provide further insights."
      },
      {
        "range": [31, 35],
        "result": "Above Average IQ",
        "recommendation": "Your responses suggest above-average cognitive performance; you may excel in challenging intellectual environments."
      },
      {
        "range": [36, 40],
        "result": "Superior IQ",
        "recommendation": "Your responses indicate superior cognitive abilities; further assessments could identify specific strengths for advanced learning."
      }
    ]
  }
}

5. Additional Instructions:
   - Ensure that the language is professional and that each question is uniquely phrased with varied sentence structures.
   - The answer options must combine both descriptive phrasing and numeric values, rather than only offering a numeric scale.
   - The final JSON output must be valid and formatted exactly as specified.

Generate only the final JSON prompt (without additional commentary) that will instruct a language model to produce this comprehensive 40-question IQ Test.
'''
}

def request_quiz(prompt, test_name):
    print(f"Requesting {test_name} quiz...")
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a professional test design assistant. Your output must be valid JSON without any Markdown formatting. Ensure the JSON is complete and properly formatted."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=10000
        )
        
        content = response.choices[0].message.content
        
        # Remove Markdown code block syntax if present
        if content.startswith("```json") and content.endswith("```"):
            content = content[7:-3].strip()
        elif content.startswith("```") and content.endswith("```"):
            content = content[3:-3].strip()
        
        # Try to parse the JSON
        try:
            quiz_json = json.loads(content)
            return test_name, quiz_json
        except json.JSONDecodeError as e:
            print(f"JSON parsing error for {test_name}: {e}")
            print("Invalid JSON content:", content)
            return test_name, None
            
    except Exception as e:
        print(f"Error generating {test_name} quiz: {e}")
        return test_name, None

def main():
    # Create output directory if it doesn't exist
    os.makedirs("generated_quizzes", exist_ok=True)
    
    # Create a thread pool with 4 workers
    with ThreadPoolExecutor(max_workers=4) as executor:
        # Create a dictionary to store futures
        futures = {}
        
        # Submit all quiz generation tasks
        for test_name, prompt in test_prompts.items():
            # Skip ADHD quiz if it already exists
            if test_name == "ADHD":
                output_file = f"generated_quizzes/{test_name.lower().replace(' ', '_')}_quiz.json"
                if os.path.exists(output_file):
                    print(f"Skipping {test_name} quiz - already exists at {output_file}")
                    continue
            
            # Submit the task to the thread pool
            future = executor.submit(request_quiz, prompt, test_name)
            futures[future] = test_name
        
        # Process completed tasks
        for future in as_completed(futures):
            test_name = futures[future]
            try:
                test_name, quiz = future.result()
                if quiz:
                    output_file = f"generated_quizzes/{test_name.lower().replace(' ', '_')}_quiz.json"
                    with open(output_file, "w", encoding="utf-8") as f:
                        json.dump(quiz, f, indent=4, ensure_ascii=False)
                    print(f"Successfully saved {test_name} quiz to {output_file}")
                else:
                    print(f"Failed to generate {test_name} quiz")
            except Exception as e:
                print(f"Error processing {test_name} quiz: {e}")

    print("Quiz generation process completed.")

if __name__ == "__main__":
    main()
