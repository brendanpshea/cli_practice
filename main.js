// main.js
document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
  
    /** 
     * **displaySelectionPage**: Clears the terminal and shows a list of available problem sets.
     * If provided, an **errorMessage** is displayed at the top.
     */
    function displaySelectionPage(errorMessage) {
      terminal.innerHTML = '';
      if (errorMessage) {
        const errorEl = document.createElement('div');
        errorEl.className = 'instructions blue';
        errorEl.textContent = errorMessage;
        terminal.appendChild(errorEl);
      }
      const selectionTitle = document.createElement('div');
      selectionTitle.className = 'instructions blue';
      selectionTitle.textContent = 'Select a problem set:';
      terminal.appendChild(selectionTitle);
  
      fetch('problemSets.json')
        .then(response => response.json())
        .then(problemSets => {
          problemSets.forEach(set => {
            const link = document.createElement('a');
            link.href = window.location.pathname + '?set=' + encodeURIComponent(set.file);
            link.textContent = set.name;
            link.style.color = '#00FF00';
            link.style.display = 'block';
            link.style.marginBottom = '10px';
            terminal.appendChild(link);
          });
        })
        .catch(error => {
          console.error('Error loading problem sets:', error);
        });
    }
  
    // Retrieve the URL query parameter 'set'
    const urlParams = new URLSearchParams(window.location.search);
    const problemSetFile = urlParams.get('set');
  
    // If no problem set is specified, display the selection page.
    if (!problemSetFile) {
      displaySelectionPage();
      return;
    }
  
    // Attempt to fetch the specified problem set.
    fetch(problemSetFile)
      .then(response => {
        if (!response.ok) {
          throw new Error("Problem set not found.");
        }
        return response.json();
      })
      .then(problems => {
        let currentProblemIndex = 0;
        
        // Display a welcome/intro message.
        const welcomeEl = document.createElement('div');
        welcomeEl.className = 'instructions blue';
        welcomeEl.textContent = 'Welcome to the Network Tools Practice Environment. Type your commands at the prompt. If you need help, type "help".';
        terminal.appendChild(welcomeEl);
        
        // **loadProblem**: Loads the problem at a given index.
        function loadProblem(index) {
          if (index >= problems.length) {
            const doneDiv = document.createElement('div');
            doneDiv.className = 'instructions blue';
            doneDiv.textContent = 'All problems completed.';
            terminal.appendChild(doneDiv);
            return;
          }
          const problem = problems[index];
          const problemContainer = document.createElement('div');
          problemContainer.className = 'problem-block';
          
          const instructionsEl = document.createElement('div');
          instructionsEl.className = 'instructions blue';
          instructionsEl.textContent = problem.instructions;
          problemContainer.appendChild(instructionsEl);
          
          terminal.appendChild(problemContainer);
          
          // **appendPrompt**: Adds a new inline prompt for user input.
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
                  const outputEl = document.createElement('div');
                  outputEl.className = 'output green';
                  outputEl.textContent = problem.output;
                  problemContainer.appendChild(outputEl);
                  
                  setTimeout(() => {
                    const explanationEl = document.createElement('div');
                    explanationEl.className = 'instructions blue';
                    explanationEl.textContent = problem.explanation;
                    problemContainer.appendChild(explanationEl);
                    
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
                  const helpEl = document.createElement('div');
                  helpEl.className = 'output green';
                  helpEl.textContent = 'Hint: The correct command is: ' + problem.command;
                  problemContainer.appendChild(helpEl);
                  appendPrompt();
                } else {
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
        console.error('Error loading problem set:', error);
        displaySelectionPage('Error: The requested problem set does not exist. Please choose a different problem set:');
      });
  });
  