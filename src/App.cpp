#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <memory>
#include <map>
#include "commands/ICommand.h"
#include "IO/Input/IInput.h"
#include "App.h"

// Constructor implementation
App::App(std::map<std::string, std::shared_ptr<ICommand>>& commands, std::shared_ptr<IInput> input)
	: commands(commands), input(input) {
}

// Main loop to run the application
void App::run() {
	std::string task;
	while (true) {
		task = input->getCommandPrefix();
		try {
			commands.at(task)->execute();
		}
		catch (...) {
			continue;
		}
	}
}
