/**
 * Takes an entity object as argument and returns it in JDL form.
 * @param entity {object}
 * @return {string}
 */
module.exports.createJDLEntity = (entity) => {
  var entity_string = `entity __entityName__ {
__fields__}
              `;
  let value = entity["name"];
  let output = entity_string.replace(/__entityName__/g, value);

  let fields = entity["fields"];

  let fields_string = createJDLField(fields);

  return output.replace(/__fields__/g, fields_string);
};

const replacer = (x, y) => {
  var str = `__fieldName__ __fieldType__`;
  let mapObj = {};
  mapObj["__fieldName__"] = x;
  mapObj["__fieldType__"] = y;

  var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
  str = str.replace(re, function (matched) {
    return mapObj[matched];
  });

  return str;
};

const createJDLField = (fields) => {
  let ans = "";
  for (let i in fields) {
    ans +=
      "    " + replacer(fields[i]["field_title"], fields[i]["type"]) + "\n";
  }

  return ans;
};

/**
 * Takes a relationship object as argument and returns it in JDL form.
 * @param relObj {object}
 * @return {string}
 */
module.exports.createJDLRelationship = (relObj) => {
  let rel_type = relObj["type"];
  let entity = relObj["entity"];
  let field = relObj["field"];
  let target_entity = relObj["target_entity"];

  // for one to many
  var entity_string_for_one_to_many = `relationship _rel_type_ {
_target_ to _entity_{_field}
}
`;
  // for oneToOne and ManyToOne
  var entity_string_for_one_to_one = `relationship _rel_type_ {
_entity_{_field} to _target_
}
`;

  let entity_string;
  if (rel_type === "ManyToMany") {
    rel_type = "ManyToOne";
  }

  if (rel_type === "OneToMany") {
    entity_string = entity_string_for_one_to_many;
  } else {
    entity_string = entity_string_for_one_to_one;
  }

  let output = entity_string.replace(/_rel_type_/g, rel_type);
  output = output.replace(/_entity_/g, entity);
  output = output.replace(/_field/g, target_entity.toLowerCase());
  output = output.replace(/_target_/g, target_entity);

  return output;
};
