"use strict";

let data = require("./data");

const args = process.argv.slice(2);

function isNotEmpty(arr) {
  return arr.length > 0;
}

// This function filters out every animal that does not match the string pattern
const removeNonMatching = (searchedStr, person) => {
  return person.animals.filter((animal) => {
    return animal.name.includes(searchedStr);
  });
};

const filter = (searchedStr) => {
  const newList = data.filter((q) => {
    let newCountry = q;
    newCountry.people = q.people.filter((p) => {
      let newPerson = p;
      newPerson.animals = removeNonMatching(searchedStr, p);

      // The 'animals' entry will be removed if there is nothing left inside
      return isNotEmpty(newPerson.animals);
    });

    // The 'people' entry will be removed if there is nothing left inside
    return isNotEmpty(newCountry.people);
  });

  // Check if the filtered list is not empty
  if (!isNotEmpty(newList)) {
    return "Nothing found";
  }

  return newList;
};

const count = () => {
  const newList = data.map((country) => {
    country.people.map((person) => {
      person.name = `${person.name} [${person.animals.length}]`;
      return person;
    });
    country.name = `${country.name} [${country.people.length}]`;
    return country;
  });
  return newList;
};

// USAGE: node app.js --filter=[PATTERN] OR node app.js filter=[PATTERN]
// USAGE: node app.js --count OR node app.js count

function processCommands(args) {
  let filterPattern = null;
  let countFlag = false;

  // Process each command line argument
  for (let i = 0; i < args.length; i++) {
    const cmd = args[i].split("=");
    // Check for --filter or filter argument
    if ((cmd[0] === "--filter" || cmd[0] === "filter") && cmd.length === 2) {
      filterPattern = cmd[1];
      // Check for --count or count argument
    } else if (cmd[0] === "--count" || cmd[0] === "count") {
      countFlag = true;
    } else {
      return "Wrong argument";
    }
  }

  // If a filter pattern was provided, apply the filter function
  if (filterPattern) {
    const filteredData = filter(filterPattern);
    if (filteredData === "Nothing found") {
      return filteredData;
    } else {
      data = filteredData;
    }
  }

  // If the count flag was provided, apply the count function
  if (countFlag) {
    if (!Array.isArray(data)) {
      return "Can't count, data is not in the correct format";
    }
    data = count(data);
  }

  // Return the data as a formatted JSON string
  return JSON.stringify(data, null, 2);
}

try {
  const output = processCommands(args);
  console.log(output);
} catch (err) {
  throw err;
}

module.exports = {
  count,
  filter,
};
