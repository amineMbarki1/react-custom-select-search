import { useForm, Controller } from "react-hook-form";
import Card from "./components/Card";
import SelectSearch, { MultiSelectSearch } from "./components/SelectSearch";

import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";

const cities = [
  { name: "Tunis", zip: 10 },
  { name: "Sousse", zip: 4023 },
  { name: "Monastir", zip: 4023 },
  { name: "Mahdia", zip: 4023 },
  { name: "Sidi Bouzid", zip: 4023 },
];

function App() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [formData, setFormData] = useState(null);
  const onSubmit = (values) => {
    console.log(values);
    setFormData(values);
  };

  console.log();
  return (
    <div className="container mt-5">
      <Card>
        <Card.Header></Card.Header>
        <Card.Body>
          <p>
            <strong>City: </strong>
            {formData?.city.name + " - "} {formData?.city.zip}
          </p>
          <p>
            <strong>Cities: </strong>
            {formData?.cities
              .map((city) => `${city.name} - ${city.zip}`)
              .join(", ")}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} id="form">
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label>Select City</label>
                  <Controller
                    rules={{ required: true }}
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <SelectSearch
                        field={field}
                        isInvalid={!!errors.city}
                        options={cities}
                        getSelectValue={(option) => option.name}
                        renderItem={(option) => (
                          <CityItem name={option.name} zip={option.zip} />
                        )}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Select Cities</label>
                  <Controller
                    rules={{ validate: validateMultiSelect }}
                    name="cities"
                    control={control}
                    render={({ field }) => (
                      <MultiSelectSearch
                        isInvalid={!!errors.cities}
                        onSelect={() => {}}
                        field={field}
                        options={cities}
                        getSelectValue={(option) => option.name}
                        renderItem={(option) => (
                          <CityItem name={option.name} zip={option.zip} />
                        )}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Card.Body>
        <Card.Footer>
          <button type="submit" form="form" className="btn btn-primary">
            Submit
          </button>
        </Card.Footer>
      </Card>
    </div>
  );
}

function CityItem({ name, zip }) {
  return (
    <>
      <strong>{name}</strong>
      <br />
      <small>{zip}</small>
    </>
  );
}

export default App;

function validateMultiSelect(choices) {
  if (!choices || choices.length === 0) return "Invalid";
  return true;
}
