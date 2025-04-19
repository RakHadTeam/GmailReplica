#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <map>
#include "commands/ICommand.h"
#include "IO/Input/IInput.h"

class App {
private:
	std::map<std::string, std::shared_ptr<ICommand>> commands; // Map to store command objects
	std::shared_ptr<IInput> input;

public:
	App(std::map<std::string, std::shared_ptr<ICommand>>& commands) : commands(commands) {} // Constructor to initialize commands

	void run() {

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
};
