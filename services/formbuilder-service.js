var Data = {
  Entities: [
    {
      name: "Employee",
      fields: [
        { field_title: "Firstname", type: "string" },
        { field_title: "Lastname", type: "string" },
        { field_title: "Lastname", type: "string" },
        { field_title: "Lastname", type: "string" },
        { field_title: "Lastname", type: "string" },
      ],
    },
    {
      name: "Country",
      fields: [
        { field_title: "Firstname", type: "string" },
        { field_title: "population", type: "long" },
      ],
    },
  ],

  relationships: [
    {
      type: "one to many",
      entity: "Employee",
    },
  ],
};

const relationships = Data["relationships"];

/**
 * Takes an entity object as argument and returns it in JDL form.
 * @param entity {object}
 * @return {string}
 */
function createJDLRelationship(entity) {
  var entity_string = `entity __entityName__ {
__fields__}
              `;

function createJDLField(fields) {
    function replacer(x, y) {
      var str = `__fieldName__ __fieldType__`;
      let mapObj = {};
      mapObj["__fieldName__"] = x;
      mapObj["__fieldType__"] = y;

      var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      str = str.replace(re, function (matched) {
        return mapObj[matched];
      });

      return str;
    }

    return ans;
  }

  fields_string = createJDLField(fields);

  return output.replace(/__fields__/g, fields_string);
}


console.log(createJDLRelationship(relationships[1]));
