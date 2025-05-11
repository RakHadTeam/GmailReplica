#include <App/App.h>
// Constructor implementation
App::App(std::map<std::string, std::shared_ptr<ICommand>>& commands, std::shared_ptr<IInput> input, std::shared_ptr<IOutput> output)
	: commands(commands), input(input), output(output) {
}

// Main loop to run the application
void App::run() {
	std::string task;
	while (true) {
		std::shared_ptr<Request> request = input->getRequest();
		auto it = commands.find(request->getMethod());
		if (it != commands.end()) {
			std::shared_ptr<Response> response = it->second->execute(request);
			output->sendResponse(response);
		}
		else {
			output->sendResponse(std::make_shared<Response>(StatusCode::BAD_REQUEST));
		}
	}
}