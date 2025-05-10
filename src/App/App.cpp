#include <App/App.h>

// Constructor implementation
App::App(std::map<std::string, std::shared_ptr<ICommand>>& commands, std::shared_ptr<IInput> input)
	: commands(commands), input(input) {
}

// Main loop to run the application
void App::run() {
	std::string task;
	while (true) {
		std::shared_ptr<Request> request = input->getRequest();
		try {
			commands.at(request->getMethod())->execute(request);
		}
		catch (...) {
			continue;
		}
	}
}
