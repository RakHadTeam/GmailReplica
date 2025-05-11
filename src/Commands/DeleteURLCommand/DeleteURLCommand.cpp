// Commands/DeleteURLCommand/DeleteURLCommand.cpp
#include <Commands/DeleteURLCommand/DeleteURLCommand.h>

DeleteURLCommand::DeleteURLCommand(BloomFilter& bloomFilter)
    : bloomFilter(bloomFilter) {
}

std::shared_ptr<Response> DeleteURLCommand::execute(std::shared_ptr<Request> request) {
    std::string url = request->getParameter("url");

    if (url.empty()) {
        return std::make_shared<Response>(StatusCode::BAD_REQUEST);
    }

    if (bloomFilter.containsInDB(url)) {
        bloomFilter.remove(url);
        return std::make_shared<Response>(StatusCode::OK);
    } else {
        return std::make_shared<Response>(StatusCode::NOT_FOUND);
    }
}
