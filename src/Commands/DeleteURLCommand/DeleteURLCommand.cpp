// Commands/DeleteURLCommand/DeleteURLCommand.cpp
#include <Commands/DeleteURLCommand/DeleteURLCommand.h>

DeleteURLCommand::DeleteURLCommand(BloomFilter& bloomFilter,
                                   std::shared_ptr<IInput> input,
                                   std::shared_ptr<IOutput> output)
    : bloomFilter(bloomFilter), input(input), output(output) {
}

void DeleteURLCommand::execute(std::shared_ptr<Request> request) {
    std::string url = request->getParameter("url");

    if (url.empty()) {
        output->sendResponse(std::make_shared<Response>(StatusCode::BAD_REQUEST));
        return;
    }

    if (bloomFilter.containsInArray(url)) {
        bloomFilter.remove(url);
        output->sendResponse(std::make_shared<Response>(StatusCode::OK, "true"));
    } else {
        output->sendResponse(std::make_shared<Response>(StatusCode::NOT_FOUND, "false"));
    }
}
