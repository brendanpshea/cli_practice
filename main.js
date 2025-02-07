// main.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('problems.json')
      .then(response => response.json())
      .then(problems => {
        let currentProblemIndex = 0;
        const terminal = document.getElementById('terminal');
  
        // Display a welcome/intro message.
        const welcomeEl = document.createElement('div');
        welcomeEl.className = 'instructions blue';
        welcomeEl.textContent = 'Welcome to the Network Tools Practice Environment. Type your commands at the prompt. If you need help, type "help".';
        terminal.appendChild(welcomeEl);
  
        // Load a problem block.
        function loadProblem(index) {
          if (index >= problems.length) {
            const doneDiv = document.createElement('div');
            doneDiv.className = 'instructions blue';
            doneDiv.textContent = 'All problems completed.';
            terminal.appendChild(doneDiv);
            return;
          }
          const problem = problems[index];
  
          // Create a container for the current problem.
          const problemContainer = document.createElement('div');
          problemContainer.className = 'problem-block';
  
          // Append instructions (in blue).
          const instructionsEl = document.createElement('div');
          instructionsEl.className = 'instructions blue';
          instructionsEl.textContent = problem.instructions;
          problemContainer.appendChild(instructionsEl);
  
          terminal.appendChild(problemContainer);
  
          // Append a new prompt line for each attempt.
          function appendPrompt() {
            const promptLine = document.createElement('div');
            promptLine.className = 'prompt-line';
  
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = problem.promptAppearance || 'student@linux:~$';
            if (!promptSpan.textContent.endsWith(' ')) {
              promptSpan.textContent += ' ';
            }
            promptLine.appendChild(promptSpan);
  
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.className = 'commandInput';
            inputField.autofocus = true;
            promptLine.appendChild(inputField);
  
            problemContainer.appendChild(promptLine);
            inputField.focus();
  
            inputField.addEventListener('keydown', function(e) {
              if (e.key === 'Enter') {
                e.preventDefault();
                const userCommand = inputField.value.trim();
                inputField.disabled = true;
  
                if (userCommand === problem.command) {
                  // Correct command: print output and explanation.
                  const outputEl = document.createElement('div');
                  outputEl.className = 'output green';
                  outputEl.textContent = problem.output;
                  problemContainer.appendChild(outputEl);
  
                  setTimeout(() => {
                    const explanationEl = document.createElement('div');
                    explanationEl.className = 'instructions blue';
                    explanationEl.textContent = problem.explanation;
                    problemContainer.appendChild(explanationEl);
  
                    // After a delay, add a separator and load the next problem.
                    setTimeout(() => {
                      const separator = document.createElement('div');
                      separator.className = 'separator';
                      separator.textContent = '--------------------------------------------------';
                      terminal.appendChild(separator);
                      currentProblemIndex++;
                      loadProblem(currentProblemIndex);
                    }, 3000);
                  }, 1000);
  
                } else if (userCommand.toLowerCase() === 'help') {
                  // If the user types help, show the correct command.
                  const helpEl = document.createElement('div');
                  helpEl.className = 'output green';
                  helpEl.textContent = 'Hint: The correct command is: ' + problem.command;
                  problemContainer.appendChild(helpEl);
                  appendPrompt();
  
                } else {
                  // Unrecognized command: print error and prompt for another attempt.
                  const errorEl = document.createElement('div');
                  errorEl.className = 'output green';
                  errorEl.textContent = 'Command not recognized. Please try again.';
                  problemContainer.appendChild(errorEl);
                  appendPrompt();
                }
              }
            });
          }
  
          appendPrompt();
        }
  
        loadProblem(currentProblemIndex);
      })
      .catch(error => {
        console.error('Error loading problems:', error);
      });
  });
  