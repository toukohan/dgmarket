import React, { useState } from "react";
import { useAuth } from "../store/authContext";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { loginSchema, registerSchema } from "../../../../packages/schemas/authSchemas";

type Mode = "login" | "register";

type SchemaKeys<M extends Mode> = M extends "login"
  ? keyof typeof loginSchema.shape
  : keyof typeof registerSchema.shape;

export default function AuthForms() {
  const [mode, setMode] = useState<Mode>("login");
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { login, register } = useAuth();

  const handleInputChange = (identifier: string, value: string) => {
    setFormInput((prev) => ({
      ...prev,
      [identifier]: value,
    }));
  };

  const validateInput = <M extends Mode>(mode: M, identifier: SchemaKeys<M>, value: unknown) => {
    // Pick the right schema dynamically
    const schema =
      mode === "login"
        ? loginSchema.pick({ [identifier]: true } as Record<SchemaKeys<"login">, true>)
        : registerSchema.pick({ [identifier]: true } as Record<SchemaKeys<"register">, true>);

    // Parse the value
    const result = schema.safeParse({ [identifier]: value });

    return result.success ? undefined : result.error.issues[0].message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register") {
      if (formInput.password !== formInput.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "passwords don't match",
        }));
        return;
      }
      if (formInput.name == "") {
        setErrors((prev) => ({
          ...prev,
          name: "Name is required",
        }));
        return;
      }
      await register(formInput.name, formInput.email, formInput.password);
    } else {
      await login(formInput.email, formInput.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-center">
            {mode === "login" ? "Login" : "Create an Account"}
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formInput.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 leading-tight">{errors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formInput.email}
                onBlur={(e) =>
                  setErrors((prev) => ({
                    ...prev,
                    email: validateInput(mode, "email", e.target.value),
                  }))
                }
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 leading-tight">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formInput.password}
                onBlur={(e) =>
                  setErrors((prev) => ({
                    ...prev,
                    password: validateInput(mode, "password", e.target.value),
                  }))
                }
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 leading-tight">{errors.password}</p>
              )}
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={formInput.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 leading-tight">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <Button className="w-full" type="submit">
              {mode === "login" ? "Login" : "Register"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
