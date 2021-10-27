import { useEffect, useState } from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initial state is 'true' because we fetch the meals data as soon as the component renders; would usually be set to false
  const [httpError, setHttpError] = useState(); // Leaving the `useState` parameters empty like this, gives an initial state of 'undefined'

  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch('https://react-http-94026-default-rtdb.europe-west1.firebasedatabase.app/meals.json');

      if (!response.ok) {
        throw new Error('Something went wrong!') // Could also look into the error response and see if they server gave us a more useful error message here
      }

      const responseData = await response.json();

      const loadedMeals = []

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    }

    // As 'fetchMeals' is an async function, it always returns a promise, so we cannot just wrap 'fetchMeals()' inside a try/catch block
    // Throwing an error inside a promise, will cause that promise to reject
    // As it returns a promise, we can call '.then()' (not done here) and '.catch()' on this promise, and handle the error that way
    fetchMeals().catch(error => {
      setIsLoading(false)
      setHttpError(error.message)
    });
  }, []);

  // Having this 'if' statement here, if 'isLoading' is true, we return this jsx, and the code below this 'if' statement is never executed
  if (isLoading) {
    return (
      <section className={classes['meals-loading']}>
        <p>Loading...</p>
      </section>
    )
  };

  if (httpError) {
    return (
      <section className={classes['meals-error']}>
        <p>{httpError}</p>
      </section>
    )
  };

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
