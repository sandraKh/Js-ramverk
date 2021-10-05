import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

const endpoint = "https://saku16-jsramverk.azurewebsites.net/graphql/";
const Docs_QUERY = `
    {  
    docs {
      creator,
      title
    }
  }
`;


export default function GraphQl() {
  const user = JSON.parse(localStorage.getItem('profile'));
  let docsCreated = 0;
  let titlesCreated = [];
  const { data, isLoading, error } = useQuery("launches", () => {
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: Docs_QUERY })
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Error fetching data");
        } else {
          return response.json();
        }
      })
      .then((data) => data.data);
  });

  if (isLoading) return "Loading...";
  if (error) return <pre>{error.message}</pre>;
  console.log("data", data)
  data.docs.forEach(el => {
    if (user?.result?.email === el.creator){
      docsCreated++;
      titlesCreated.push(el.title)
    }

  });
  return (
    <div className = "userSum">
      <h4>Docs created by you: </h4>
        {docsCreated}
      <h4>With titles:</h4>
      <ul className="a">
      {titlesCreated.map(function(name, index){
                    return <li key={ index }>{name}</li>;
                  })}
      </ul>
    </div>
  );
}