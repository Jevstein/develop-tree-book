#include <iostream>
#include <fstream>
#include <string>
#include "addressbook.pb.h"

bool write_to_addressbook(const std::string &file_name)
{
    tutorial::AddressBook address_book;

    tutorial::Person *person = address_book.add_persons();
    person->set_name("alice");
    person->set_age(18);

    {
        std::fstream output(file_name, std::ios::out | std::ios::trunc | std::ios::binary);
        if (!address_book.SerializeToOstream(&output)) {
            std::cerr << "failed to write address book!" << std::endl;
            return false;
        }
        output.close();
    }

    return true;
}

bool read_from_addressbook(const std::string &file_name)
{
    tutorial::AddressBook address_book;
 
    {
        std::fstream input(file_name, std::ios::in | std::ios::binary);
        if (!address_book.ParseFromIstream(&input)) {
            std::cerr << "failed to parse address book!" << std::endl;
            return false;
        }
       input.close();
    }
 
    for (int i = 0; i < address_book.persons_size(); i++) {
        const tutorial::Person& person = address_book.persons(i);
 
        std::cout << "result: " << person.name() << " " << person.age() << std::endl;
    }

    return true;
}

int main(int argc, char **argv) {
    //GOOGLE_PROTOBUF_VERIFY_VERSION;

    std::string file_name("./addressbook");

    std::cout << "1.input address book(wirte a file) ...\n";
    if (!write_to_addressbook(file_name))
        return -1;

    std::cout << "2.output address book(read a file) ...\n";
    if (!read_from_addressbook(file_name))
        return -1;

    // Optional: Delete all global objects allocated by libprotobuf.
    //google::protobuf::ShutdownProtobufLibrary();

    return 0;
}