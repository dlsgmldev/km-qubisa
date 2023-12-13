import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

interface Category {
  id: number;
  title: string;
}

interface Form {
  title?: any;
  description?: any;
  link_external?: any;
}

const Layout = ({ children }: any) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [category, setCategory] = useState<any>();
  const [MyPoin, setMyPoin] = useState<number>();
  const [fileOrLink, setFileOrLink] = useState<string>();
  const [file, setFile] = useState<any>();
  const [search, setSearch] = useState<string>();
  const [dataCategory, setDataCategory] = useState<Category[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenParams: any = searchParams.get("token");
  const token: any = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    if (token === null) {
      localStorage.setItem("token", tokenParams);
    }
    axios
      .get(`${process.env.REACT_APP_URL}qubisa/km/participant/category`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setDataCategory(res.data.data);
      });
    axios
      .get(`${process.env.REACT_APP_URL}qubisa/km/participant/my_point`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setMyPoin(res.data.point);
      });
  }, []);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const PPData = new FormData();
    PPData.append("file", file ? file : "");
    PPData.append("title", form?.title);
    PPData.append("description", form?.description);
    PPData.append(
      "link_external",
      form?.link_external ? form?.link_external : ""
    );
    PPData.append("id_category", category);
    await axios
      .post(
        `${process.env.REACT_APP_URL}qubisa/km/participant/create`,
        PPData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload()
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="pt-5">
      <div className="px-4 flex">
        <i className="fa-solid fa-chevron-left text-xl me-4"></i>
        <p className="my-auto text-xl font-bold">MKM</p>
      </div>
      <div className="flex justify-between px-4 mt-6">
        <input
          type="text"
          className="bg-transperancy-50 text-sm rounded-xl p-2.5 w-full me-5"
          placeholder="Search Knowledge Here"
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button
          className="button btn bg-primary rounded-xl p-1.5 w-24"
          onClick={() => setShowCreate(true)}
        >
          + Create
        </button>
      </div>
      <div className="grid grid-flow-col justify-stretch mt-5 text-sm text-center">
        <p
          className={`hover:border-b-2 border-error p-3 cursor-pointer ${
            location.pathname === "/" && "border-b-2"
          }`}
          onClick={() => navigate("/")}
        >
          All Post
        </p>
        <p
          className={`hover:border-b-2 border-error p-3 cursor-pointer ${
            location.pathname === "/my-poin" && "border-b-2"
          }`}
          onClick={() => navigate("/my-poin")}
        >
          My Poin ({MyPoin})
        </p>
        <p
          className={`hover:border-b-2 border-error p-3 cursor-pointer ${
            location.pathname === "/history" && "border-b-2"
          }`}
          onClick={() => navigate("/history")}
        >
          History
        </p>
        {location.pathname === "/" && (
          <i
            className="fa-solid fa-filter text-white p-2 text-base cursor-pointer"
            onClick={() => setShowFilter(true)}
          ></i>
        )}
      </div>
      {children} <Outlet />
      {/* modal */}
      {showFilter && (
        <>
          <div className="justify-end items-end flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full">
              <div className="bg-transperancy-50 border-0 rounded-t-xl relative flex flex-col w-full outline-none focus:outline-none">
                <button
                  className="p-2 ml-auto border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowFilter(false)}
                >
                  <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
                <p className="text-xl font-bold text-center mb-3">Kategori</p>
                <div className="border-b p-6 flex justify-between">
                  <p>Human Resource</p>
                  <input type="checkbox" className="w-4 h-4 bg-gray-100" />
                </div>
                <div className="border-b p-6 flex justify-between">
                  <p>IT</p>
                  <input type="checkbox" className="w-4 h-4 bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {showCreate && (
        <>
          <div className="justify-end items-end flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full">
              <div className="bg-transperancy-50 border-0 rounded-t-xl relative flex flex-col w-full outline-none focus:outline-none">
                <button
                  className="p-2 ml-auto border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowCreate(false)}
                >
                  <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
                <p className="text-xl font-bold text-center mb-3">Create MKM</p>
                <form className="p-4 gap-4 grid">
                  <input
                    type="text"
                    placeholder="Title*"
                    name="title"
                    className="bg-black border text-white text-sm rounded w-full p-2.5"
                    onChange={handleChange}
                  />
                  <select
                    className="bg-black border text-white text-sm rounded w-full p-2.5"
                    name="category"
                    onChange={(e) => setCategory(Number(e.target.value))}
                  >
                    <option>Category*</option>
                    {dataCategory.map((item) => (
                      <option value={item.id}>{item.title}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Deskripsi*"
                    name="description"
                    className="bg-black border text-white text-sm rounded w-full p-2.5"
                    onChange={handleChange}
                  />
                  <select
                    className="bg-black border text-white text-sm rounded w-full p-2.5"
                    onChange={(e) => setFileOrLink(e.target.value)}
                  >
                    <option>Pilih*</option>
                    <option value="file">File</option>
                    <option value="link">Link</option>
                  </select>
                  {fileOrLink === "file" && (
                    <input
                      type="file"
                      placeholder="Category*"
                      className="bg-black border text-white text-sm rounded w-full p-2.5"
                      accept=".jpg, .png, .mp4, .mp3"
                      onChange={handleChangeFile}
                    />
                  )}
                  {fileOrLink === "link" && (
                    <input
                      type="text"
                      placeholder="Link*"
                      name="link_external"
                      className="bg-black border text-white text-sm rounded w-full p-2.5"
                      onChange={handleChange}
                    />
                  )}
                  <div
                    className="btn button bg-primary rounded p-2.5 mt-5 text-center cursor-pointer"
                    onClick={handleSubmit}
                  >
                    Submit
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
};

export default Layout;
