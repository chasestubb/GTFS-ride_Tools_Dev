This is a README file to explain this empty folder. It seems to be a common problem with .gitignore

The situation is we need there to be an empty folder for passing the file upload from the frontend to the backend, but when we include the contents of the /uploads folder to the .gitignore, it by default ignores the folder as well breaking the function.

See this stackoverflow entry https://stackoverflow.com/questions/115983/how-can-i-add-an-empty-directory-to-a-git-repository?page=1&tab=votes#tab-top. It seems as though there are many opinions on how to handle this sort of problem.
