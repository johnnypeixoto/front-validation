import { useCallback, useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";
import { Switch } from "./components/ui/switch";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Shell } from "@/components/shells/shell";
import { taskSchema } from "@/lib/validations/schema";
import { z } from "zod";

function App() {
  const { i18n, t } = useTranslation();
  const [languageSelected, setLanguageSelected] = useState(i18n.language);
  console.log("🚀 ~ App ~ languageSelected:", languageSelected);
  const handleChangeLanguage = useCallback((language: string) => {
    i18n.changeLanguage(language);
    setLanguageSelected(language);
  }, []);
  useEffect(() => {
    // NOTE: This should be set based on some kind of toggle or theme selector.
    // I've added this here for demonstration purposes
    // localStorage.setItem("theme", "light");

    // If the user has selected a theme, use that
    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
      setThemeSwitch(selectedTheme === "theme-dark" ? true : false);
      // Else if the users OS preferences prefers dark mode
    }
  }, []);

  const [themeSwitch, setThemeSwitch] = useState(false);

  async function getTasks() {
    const res = await fetch(
      "https://my.api.mockaroo.com/tasks.json?key=f0933e60"
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();

    // ** Workaround as my mock api has date returned as "dd-Mon-yyyy"
    const tasks = z.array(taskSchema).parse(
      data.map((task: any) => {
        task.due_date = new Date(Date.parse(task.due_date));
        return task;
      })
    );
    return tasks;
  }

  const [tasks, setTasks]: any = useState([]);
  const getData = async () => {
    const tasksData = await getTasks();
    setTasks(tasksData);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className=" flex flex-col justify-center items-center">
      <section className="flex flex-col w-6/12 p-10 gap-5 border border-input rounded-lg">
        <div className="flex flex-row items-center gap-4 w-full">
          {themeSwitch ? (
            <Moon className="text-2xl text-primary" />
          ) : (
            <Sun className="text-2xl text-primary" />
          )}
          <span className="text-lg font-light">
            {themeSwitch ? t("Dark Theme") : t("Light Theme")}
          </span>
          <Switch
            checked={themeSwitch}
            onCheckedChange={(event: boolean) => {
              setThemeSwitch(event);
              if (event) {
                localStorage.setItem("theme", "theme-dark");
                document.body.classList.add("theme-dark");
                document.body.classList.remove("theme-light");
              } else {
                localStorage.setItem("theme", "theme-light");
                document.body.classList.add("theme-light");
                document.body.classList.remove("theme-dark");
              }
            }}
          />
        </div>
        <span>{t("Predominant Color")}</span>
        <div className="flex flex-row gap-4">
          <button
            className="w-4 h-4 rounded-full bg-error-500"
            onClick={() => {
              document.body.classList.remove("theme-green");
              document.body.classList.remove("theme-orange");
              document.body.classList.add("theme-red");
            }}
          />
          <button
            className="w-4 h-4 rounded-full bg-alert300"
            onClick={() => {
              document.body.classList.remove("theme-green");
              document.body.classList.remove("theme-red");
              document.body.classList.add("theme-orange");
            }}
          />
          <button
            className="w-4 h-4 rounded-full bg-success300"
            onClick={() => {
              document.body.classList.remove("theme-orange");
              document.body.classList.remove("theme-red");
              document.body.classList.add("theme-green");
            }}
          />
          <button
            className={`w-4 h-4 rounded-full ${
              themeSwitch ? "bg-blue600" : "bg-blue200"
            }`}
            onClick={() => {
              document.body.classList.remove("theme-orange");
              document.body.classList.remove("theme-green");
              document.body.classList.remove("theme-red");
              document.body.classList.remove("theme-nice");
            }}
          />
        </div>
        <Select onValueChange={(value) => handleChangeLanguage(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("Select Language")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("Language")}</SelectLabel>
              <SelectItem value="pt-BR">{t("Portuguese")}</SelectItem>
              <SelectItem value="en-US">{t("English")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="">
          <h1 className="text-primary">{t("Hello World")}</h1>
        </div>
        <Shell>
          <div className="flex h-full min-h-screen w-full flex-col">
            <DataTable data={tasks} columns={columns} />
          </div>
        </Shell>
      </section>
    </div>
  );
}

export default App;
