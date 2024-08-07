/* eslint-disable react/prop-types */
const StringToList = ({ inputString }) => {
  // Convertir el string en una lista de items
  const itemsArray = inputString.split(";");

  return (
    <div className="string-to-list">
      <ul>
        {itemsArray.map((item, index) => (
          <li
            key={index}
            className="text-size">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StringToList;
