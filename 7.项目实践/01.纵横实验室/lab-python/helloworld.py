#!/usr/bin/python
# -*- coding: latin-1 -*-

'''
?????????????
?????????????
?????????????
'''

"""
?????????????
????????????? 
?????????????
"""

# 1.hello world & string operation ######################################
print ('# 1.hello world & string operation ######################################')
title = "               output: "
msg = "Hello 'python' world!   "
msg = title + msg;

print (msg.title())
print (msg.upper())
print (msg.lower())
print (msg.rstrip())
print (msg.strip())

# 2.int & string operation ######################################
print("\n # 2.int & string operation ######################################")
age = 120
name = 'yi'
print (name + '_' + str(age))

# 3.list
print("\n")
bicycles = ['trek', 'cannondale', 'redline', 'specialized']
print (bicycles)
print (bicycles[2])

bicycles[1] = "m_hello"
print (bicycles)

bicycles.append('ducati+')
print (bicycles)

bicycles.insert(2, '++ducati')
print (bicycles)

bicycles.remove('++ducati')
print (bicycles)

del bicycles[0]
print (bicycles)

print (bicycles.pop())
print (bicycles)

# 4.sort ######################################
print("\n # 4.sort ######################################")
cars = ['bmw', 'audi', 'toyota', 'subaru']
print(cars)

cars.sort()
print(cars)

cars.sort(reverse=True)
print(cars)

print(sorted(cars))
print(cars)

cars.reverse()
print (cars)
print (len(cars))

for car in cars:
    print car

print (cars)
for car in cars:
    if car == 'bmw':
        print(car.upper())
    else:
        print(car.title())

# 5.range ######################################
print("\n # 5.range ######################################")
for value in range(1, 5):
    print(value)

numbers = list(range(1, 6))
print(numbers)

even_numbers = list(range(2, 12, 3))
print(even_numbers)

squares = []
for value in range(1, 11):
    square = value**2
    squares.append(square)
print(squares)

for value in range(1, 11):
    squares.append(value**2)
print(squares)

# ??
players = ['charles', 'martina', 'michael', 'florence', 'eli']
print(players[0:3])
print(players[-3:-1])

# ??
dimensions = (200, 50)
for dimension in dimensions:
    print(dimension)

# 6.if ######################################
print("\n # 6.if ######################################")
banned_users = ['andrew', 'carolina', 'david']
user = 'marie'
if user not in banned_users:
    print(user.title() + ", you can post a response if you wish.")

age = 12
if age < 4:
    print("Your admission cost is $0.")
elif age < 18:
    print("Your admission cost is $5.")
else:
    print("Your admission cost is $10.")

requested_toppings = ['pizza001']
if requested_toppings:
    for requested_topping in requested_toppings:
        print("Adding " + requested_topping + ".")
    print("\nFinished making your pizza!")
else:
    print("Are you sure you want a plain pizza?")

# 7.dictionary ######################################
print("\n # 7.dictionary ######################################")
# ??
alien_0 = {'color': 'green', 'points': 5}
print(alien_0)
print(alien_0['color'])
print(alien_0['points'])

alien_0['x_position'] = 0
alien_0['y_position'] = 25
print(alien_0)

alien_0 = {'color': 'green'}
print("The alien is " + alien_0['color'] + ".")
alien_0['color'] = 'yellow'
print("The alien is now " + alien_0['color'] + ".")

alien_0 = {'x_position': 0, 'y_position': 25, 'speed': 'medium'}
print("Original x-position: " + str(alien_0['x_position']))
# ???????
# ????????????????
if alien_0['speed'] == 'slow':
    x_increment = 1
elif alien_0['speed'] == 'medium':
    x_increment = 2
else:
    # ????????????
    x_increment = 3
# ????????????
alien_0['x_position'] = alien_0['x_position'] + x_increment
print("New x-position: " + str(alien_0['x_position']))

alien_0 = {'color': 'green', 'points': 5}
print(alien_0)
del alien_0['points']
print(alien_0)

user_0 = {
'username': 'efermi',
'first': 'enrico',
'last': 'fermi',
}
for key, value in user_0.items():
    print("\nKey: " + key)
    print("Value: " + value)

# ???????????????
aliens = []
# ??30???????
for alien_number in range (0,30):
    aliens.append({'color': 'green', 'points': 5, 'speed': 'slow'})
# print(aliens)
for alien in aliens[0:3]:
    if alien['color'] == 'green':
        alien['color'] = 'yellow'
        alien['speed'] = 'medium'
        alien['points'] = 10
# ????????
for alien in aliens[0:5]:
    print(alien)
    print("...")

# ?? + ??
# ?????????
pizza = {
'crust': 'thick',
'toppings': ['mushrooms', 'extra cheese'],
}
# ???????
print("You ordered a " + pizza['crust'] + "-crust pizza " +
"with the following toppings:")
for topping in pizza['toppings']:
    print("\t" + topping)

users = {
'aeinstein': {
'first': 'albert',
'last': 'einstein',
'location': 'princeton',
},
'mcurie': {
'first': 'marie',
'last': 'curie',
'location': 'paris',
},
}
for username, user_info in users.items():
    print("\nUsername: " + username)
    full_name = user_info['first'] + " " + user_info['last']
    location = user_info['location']
    print("\tFull name: " + full_name.title() + ", location: " + location)


# 8.input ######################################
print("\n # 8.input ######################################")

# message = input("Tell me something, and I will repeat it back to you: ")
# print(message)

# ??????????????
# ????????????????
unconfirmed_users = ['alice', 'brian', 'candace']
confirmed_users = []
# ??????????????????
# ?????????????????????
while unconfirmed_users:
    current_user = unconfirmed_users.pop()
    print("Verifying user: " + current_user.title())
    confirmed_users.append(current_user)
# ??????????
print("\nThe following users have been confirmed:")
for confirmed_user in confirmed_users:
    print(confirmed_user.title())

pets = ['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat']
print(pets)
while 'cat' in pets:
    pets.remove('cat')
print(pets)

"""
responses = {}
# ???????????????
polling_active = True
while polling_active:
    # ??????????????
    name = input("\nWhat is your name? ")
    response = input("Which mountain would you like to climb someday? ")
    # ?????????
    responses[name] = response
    # ????????????
    repeat = input("Would you like to let another person respond? (yes/ no) ")
    if repeat == 'no':
        polling_active = False
    # ?????????
    print("\n--- Poll Results ---")
for name, response in responses.items():
    print(name + " would like to climb " + response + ".")
"""

# 9.function ######################################
print("\n # 9.function ######################################")
def greet_user(username):
    """????????"""
    print("Hello, " + username.title() + "!")
greet_user('jesse')

def describe_pet(animal_type, pet_name):
    """???????"""
    print("\nI have a " + animal_type + ".")
    print("My " + animal_type + "'s name is " + pet_name.title() + ".")
describe_pet('hamster', 'harry')

def describe_pet(animal_type, pet_name):
    """???????"""
    print("\nI have a " + animal_type + ".")
    print("My " + animal_type + "'s name is " + pet_name.title() + ".")
describe_pet(animal_type='hamster', pet_name='harry')

def describe_pet(pet_name, animal_type='dog'):
    """???????"""
    print("\nI have a " + animal_type + ".")
    print("My " + animal_type + "'s name is " + pet_name.title() + ".")
describe_pet(pet_name='willie')

def get_formatted_name(first_name, last_name):
    "???????"""
    full_name = first_name + ' ' + last_name
    return full_name.title()
musician = get_formatted_name('jimi', 'hendrix')
print('\n' + musician)

def get_formatted_name(first_name, last_name, middle_name=''):
    """???????"""
    if middle_name:
        full_name = first_name + ' ' + middle_name + ' ' + last_name
    else:
        full_name = first_name + ' ' + last_name
    return full_name.title()
musician = get_formatted_name('jimi', 'hendrix')
print(musician)
musician = get_formatted_name('john', 'hooker', 'lee')
print(musician)


# ?????????????????????
unprinted_designs = ['iphone case', 'robot pendant', 'dodecahedron']
completed_models = []
# ?????????????????????
# ???????????????completed_models?
while unprinted_designs:
    current_design = unprinted_designs.pop()
    #????????3D???????
    print("Printing model: " + current_design)
    completed_models.append(current_design)
# ??????????
print("\nThe following models have been printed:")
for completed_model in completed_models:
    print(completed_model)

print ('# ***************************************************************************')
def print_models(unprinted_designs, completed_models):
    """
    ?????????????????????
    ???????????????completed_models?
    """
    while unprinted_designs:
        current_design = unprinted_designs.pop()
        # ????????3D???????
        print("Printing model: " + current_design)
        completed_models.append(current_design)

def show_completed_models(completed_models):
    """??????????"""
    print("\nThe following models have been printed:")
    for completed_model in completed_models:
        print(completed_model)

unprinted_designs = ['iphone case', 'robot pendant', 'dodecahedron']
completed_models = []
print ({'unprinted_designs': unprinted_designs})
#?????????????
print_models(unprinted_designs[:], completed_models)
print ({'unprinted_designs': unprinted_designs})
print_models(unprinted_designs, completed_models)
show_completed_models(completed_models)
print ({'unprinted_designs': unprinted_designs})

print ('# ***************************************************************************')

def make_pizza(*toppings):
    """??????????"""
    print(toppings)
make_pizza('pepperoni')
make_pizza('mushrooms', 'green peppers', 'extra cheese')

def make_pizza(*toppings):
    """????????"""
    print("\nMaking a pizza with the following toppings:")
    for topping in toppings:
        print("- " + topping)
make_pizza('pepperoni')
make_pizza('mushrooms', 'green peppers', 'extra cheese')

def make_pizza(size, *toppings):
    """????????"""
    print("\nMaking a " + str(size) +
    "-inch pizza with the following toppings:")
    for topping in toppings:
        print("- " + topping)
make_pizza(16, 'pepperoni')
make_pizza(12, 'mushrooms', 'green peppers', 'extra cheese')

def build_profile(first, last, **user_info):
    """???????????????????????"""
    profile = {}
    profile['first_name'] = first
    profile['last_name'] = last
    for key, value in user_info.items():
        profile[key] = value
    return profile
user_profile = build_profile('albert', 'einstein',
location='princeton',
field='physics')
print(user_profile)


# 10.class ######################################
print ('\n# 10.class ######################################')
class Dog():
    """???????????"""
    def __init__(self, name, age):
        """?????name?age"""
        self.name = name
        self.age = age
    def sit(self):
        """??????????"""
        print(self.name.title() + " is now sitting.")
    def roll_over(self):
        """??????????"""
        print(self.name.title() + " rolled over!")

my_dog = Dog('willie', 6)
your_dog = Dog('lucy', 3)
print("My dog's name is " + my_dog.name.title() + ".")
print("My dog is " + str(my_dog.age) + " years old.")
my_dog.sit()
print("\nYour dog's name is " + your_dog.name.title() + ".")
print("Your dog is " + str(your_dog.age) + " years old.")
your_dog.sit()

print ('\n')

class Car(object):
    """???????????"""
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year
        self.odometer_reading = 0
    def get_descriptive_name(self):
        long_name = str(self.year) + ' ' + self.make + ' ' + self.model
        return long_name.title()
    def read_odometer(self):
        print("This car has " + str(self.odometer_reading) + " miles on it.")
    def update_odometer(self, mileage):
        if mileage >= self.odometer_reading:
         self.odometer_reading = mileage
        else:
            print("You can't roll back an odometer!")
    def increment_odometer(self, miles):
        self.odometer_reading += miles

class ElectricCar(Car):
    """?????????"""
    def __init__(self, make, model, year):
        """????????"""
        super(ElectricCar, self).__init__(make, model, year)
        self.battery_size = 70

    def describe_battery(self):
        """?????????????"""
        print("This car has a " + str(self.battery_size) + "-kWh battery.")

my_tesla = ElectricCar('tesla', 'model s', 2016)
print(my_tesla.get_descriptive_name())
print(my_tesla.describe_battery())


# 11.import ######################################
print ('\n# 11.import ######################################')


from collections import OrderedDict

favorite_languages = OrderedDict()
favorite_languages['jen'] = 'python'
favorite_languages['sarah'] = 'c'
favorite_languages['edward'] = 'ruby'
favorite_languages['phil'] = 'python'

for name, language in favorite_languages.items():
    print(name.title() + "'s favorite language is " + language.title() + ".")

# 12.file-read######################################
print ('\n# 12.file ######################################')
with open('pi_digits.txt') as file_object:
    contents = file_object.read()
print(contents.rstrip())

print ('\n')
filename = 'pi_digits.txt'
with open(filename) as file_object:
    for line in file_object:
        print(line.rstrip())

print ('\n')
filename = 'pi_digits.txt'
with open(filename) as file_object:
    lines = file_object.readlines()
for line in lines:
    print(line.rstrip())

print ('\n')
filename = 'pi_digits.txt'
with open(filename) as file_object:
    lines = file_object.readlines()
pi_string = ''
for line in lines:
    pi_string += line.strip()
print(pi_string)
print(len(pi_string))

print ('\n')
filename = 'pi_digits.txt'
with open(filename) as file_object:
    lines = file_object.readlines()
pi_string = ''
for line in lines:
    pi_string += line.rstrip()

birthday = "020386" # input("Enter your birthday, in the form mmddyy: ")
if birthday in pi_string:
    print("Your birthday appears in the first million digits of pi!")
else:
    print("Your birthday does not appear in the first million digits of pi.")

# 13.file-write ######################################
print ('\n# 13.file-write ######################################')
filename = 'programming.txt'
with open(filename, 'w') as file_object:
    file_object.write("I love python.\n")
    file_object.write("I love creating new games.\n")

with open(filename, 'a') as file_object:
    file_object.write("I also love finding meaning in large datasets.\n")
    file_object.write("I love creating apps that can run in a browser.\n")

# 14.except ######################################
print ('\n# 14.except ######################################')
try:
    print(5/0)
except ZeroDivisionError:
    print("You can't divide by zero!")

filename = 'alice.txt'
try:
    with open(filename) as f_obj:
        contents = f_obj.read()
# except FileNotFoundError: # v3.0
except IOError:
    msg = "Sorry, the file " + filename + " does not exist."
print(msg)

print ('\n')
title = "Alice in Wonderland"
title.split()
print (title)

print ('\n')
filename = 'alice.txt'
try:
    with open(filename) as f_obj:
        contents = f_obj.read()
except IOError:
    msg = "Sorry, the file " + filename + " does not exist."
    print(msg)
else:
    # ?????????????
    words = contents.split()
    num_words = len(words)
    print("The file " + filename + " has about " + str(num_words) + " words.")

print ('\n')
def count_words(filename):
    """???????????????"""
    try:
        with open(filename) as f_obj:
            contents = f_obj.read()
    except IOError:
        msg = "Sorry, the file " + filename + " does not exist."
        print(msg)
    else:
        # ?????????????
        words = contents.split()
        num_words = len(words)
        print("The file " + filename + " has about " + str(num_words) + " words.")

filenames = ['alice.txt', 'siddhartha.txt', 'moby_dick.txt', 'little_women.txt']

for filename in filenames:
    count_words(filename)

# 15.json ######################################
print ('\n# 15.json ######################################')
import json
numbers = [2, 3, 5, 7, 11, 13]
filename = 'numbers.json'
with open(filename, 'w') as f_obj:
    json.dump(numbers, f_obj)

with open(filename) as f_obj:
    numbers = json.load(f_obj)
    print(numbers)

