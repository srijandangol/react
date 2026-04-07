import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

function Form() {
  // const { register, handleSubmit, control, formState: { errors } } = useForm(
  //   defeultValues: {
  //     name: "Ram",
  //     email: "",
  //     age: 19
  //   }
  // );
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await response.json();
      return {
      name: data.name,
      email: data.email,
      age: 19,
      social: {
        facebook: "",
        twitter: "",
      },
      dob: new Date()
    }
    }
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Name */}
        <label>Name</label>
        <br />
        <input
          type="text"
          {...register("name", {
            required: "Name is required",
          })}
        />
        <p>{errors.name?.message}</p>

        {/* Email */}
        <label>Email</label>
        <br />
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Invalid email",
            },
          })}
        />
        <p>{errors.email?.message}</p>

        {/* Age */}
        <label>Age</label>
        <br />
        <input type="number" {...register("age",
           {valueAsNumber: true,})
        } />
        <p>{errors.age?.message}</p>

        {/* Date of Birth */}
        <label>Date of Birth</label>
        <br />
        <input
          type="date"
          {...register("dob",
           {valueAsdata: true,})}
        />
        <p>{errors.dob?.message}</p>

        {/* Phone Number */}
        <label>Phone Number</label>
        <br />
        <input
          type="number"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10,15}$/,
              message: "Invalid phone number",
            },
          })}
        />
        <p>{errors.phone?.message}</p>

        {/* Facebook */}
        <label>Facebook Profile</label>
        <br />
        <input
          type="url"
          placeholder="https://facebook.com/yourprofile"
          {...register("social.facebook", {
            // required: "Facebook profile is required",
            pattern: {
              value: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
              message: "Invalid Facebook URL",
            },
          })}
        />
        <p>{errors.social?.facebook?.message}</p>

        <br />
        {/* Twitter */}
        <label>Twitter Profile</label>
        <br />
        <input
          type="url"
          placeholder="https://twitter.com/yourprofile"
          {...register("social.twitter", {
            // required: "Twitter profile is required",
            pattern: {
              value: /^(https?:\/\/)?(www\.)?twitter\.com\/.+$/,
              message: "Invalid Twitter URL",
            },
          })}
        />
        <p>{errors.social?.twitter?.message}</p>

        <br />
        <button type="submit">Submit</button>
      </form>

      <DevTool control={control} placement="top-left" />
    </div>
  );
}

export default Form;