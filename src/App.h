#pragma once

#include <map>
#include <memory>
#include <string>
#include "commands/ICommand.h"
#include "IO/Input/IInput.h"

// The App class manages the execution of commands based on user input.
class App {
private:
	std::map<std::string, std::shared_ptr<ICommand>> commands; // Map to store command objects
	std::shared_ptr<IInput> input; // Input handler

public:
	// Constructor
	App(std::map<std::string, std::shared_ptr<ICommand>>& commands, std::shared_ptr<IInput> input);

	// Main loop to run the application
	void run();
};