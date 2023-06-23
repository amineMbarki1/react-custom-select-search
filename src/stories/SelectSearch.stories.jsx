import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

import SelectSearch, { MultiSelectSearch } from "../components/SelectSearch";

import Card from "../components/Card";

import "../../.storybook/plugins/fontawesome-free/css/all.min.css";

import "../../.storybook/plugins/icheck-bootstrap/icheck-bootstrap.min.css";
import "../../.storybook/plugins/jqvmap/jqvmap.min.css";
import "../../.storybook/plugins/overlayScrollbars/css/OverlayScrollbars.min.css";
import "../../.storybook/plugins/summernote/summernote-bs4.css";
import "../../.storybook/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css";
import "../../.storybook/plugins/adminlte.min.css";

export default {
  component: SelectSearch,
  title: "Select Search",
};

const cities = [
  { name: "Tunis", zip: 10 },
  { name: "Sousse", zip: 4023 },
  { name: "Monastir", zip: 4023 },
  { name: "Mahdia", zip: 4023 },
  { name: "Sidi Bouzid", zip: 4023 },
];

function SingleSelectSearchComponent() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [formData, setFormData] = useState(null);
  const onSubmit = (values) => {
    setFormData(values);
  };

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          {formData?.city && (
            <p>
              <strong>City: </strong>
              {formData.city.name + " - "} {formData.city.zip}
            </p>
          )}
          {formData?.cities && (
            <p>
              <strong>Cities: </strong>
              {formData.cities
                .map((city) => `${city.name} - ${city.zip}`)
                .join(", ")}
            </p>
          )}
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

export const SingleAndMultipleSelectSearch = {
  render: () => <SingleSelectSearchComponent />,
};

function CityItem({ name, zip }) {
  return (
    <>
      <strong>{name}</strong>
      <br />
      <small>{zip}</small>
    </>
  );
}

function validateMultiSelect(choices) {
  if (!choices || choices.length === 0) return "Invalid";
  return true;
}
