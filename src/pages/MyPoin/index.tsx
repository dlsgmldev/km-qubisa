import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

type Poin = {
  number: number;
  title: string;
  get_point: string;
  timecreated: string;
};

type InformasiPoin = {
  number: number;
  title: string;
  point: string;
  timecreated: string;
};

interface Category {
  id: number;
  title: string;
}

interface Form {
  title?: any;
  description?: any;
  link_external?: any;
}

const MyPoin = () => {
  const navigate = useNavigate();
  const [dataPoin, setDataPoin] = useState<Poin[]>([]);
  const [informasiPoin, setInformasiPoin] = useState<InformasiPoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInformation, setShowInformation] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [category, setCategory] = useState<any>();
  const [MyPoin, setMyPoin] = useState<number>();
  const [fileOrLink, setFileOrLink] = useState<string>();
  const [file, setFile] = useState<any>();
  const [search, setSearch] = useState<string>();
  const [dataCategory, setDataCategory] = useState<Category[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(2);
  const token: any = localStorage.getItem("token");

  const getData = (pageSize: number, pageIndex: number) => {
    axios
      .get(
        `${process.env.REACT_APP_URL}qubisa/km/participant/my_point_list/${
          pageSize ?? 10
        }/${pageIndex ?? 1}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        setDataPoin(res.data.data);
        setLoading(false);
      });
  };

  const fetchMoreData = () => {
    axios
      .get(
        `${process.env.REACT_APP_URL}qubisa/km/participant/my_point_list/10/${index}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setDataPoin((prevItems) => [...prevItems, ...res.data.data]);

        res.data.data.length > 0 ? setHasMore(true) : setHasMore(false);
      })
      .catch((err) => console.log(err));

    setIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    getData(10, 1);
    axios
      .get(
        `${process.env.REACT_APP_URL}qubisa/km/participant/point_information`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        setInformasiPoin(res.data.data);
      });
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
        toast.success("Created Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="pt-5">
      <div className="px-4 flex">
        {/* <i
          className="fa-solid fa-chevron-left text-xl me-4 cursor-pointer"
          onClick={() => navigate(-1)}
        ></i> */}
        <p className="my-auto text-xl font-bold">MKM</p>
      </div>
      <div className="flex justify-between px-4 mt-6">
        <input
          type="text"
          className="bg-transperancy-50 text-sm rounded-xl p-2.5 w-full me-3"
          placeholder="Search"
          disabled
        ></input>
        <button
          className="button btn bg-primary rounded-xl p-1.5 w-28"
          onClick={() => setShowCreate(true)}
        >
          + Create
        </button>
      </div>
      <div className="grid grid-flow-col justify-stretch mt-5 text-sm text-center">
        <p
          className="hover:border-b-2 border-error p-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          All Post
        </p>
        <p
          className="hover:border-b-2 border-error p-3 cursor-pointer border-b-2"
          onClick={() => navigate("/my-poin")}
        >
          My Poin ({MyPoin})
        </p>
        <p
          className="hover:border-b-2 border-error p-3 cursor-pointer"
          onClick={() => navigate("/history")}
        >
          History
        </p>
      </div>

      <div>
        {loading === true ? (
          <svg
            aria-hidden="true"
            className="w-8 h-8 mt-10 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        ) : (
          <InfiniteScroll
            dataLength={dataPoin.length}
            next={fetchMoreData}
            hasMore={hasMore}
            height="100vh"
            loader={<p className="text-center my-4">Loading...</p>}
            endMessage={
              <p className="text-center my-4">No more data to load.</p>
            }
            className="no-scrollbar"
          >
            <div className="bg-transperancy-50 divide-y divide-slate-800">
              <div className="p-6 flex justify-between">
                <p>Informasi nilai poin</p>
                <i
                  className="fa-solid fa-circle-info text-white cursor-pointer"
                  onClick={() => setShowInformation(true)}
                ></i>
              </div>
              {dataPoin.map((item) => (
                <div className="p-6 flex justify-between">
                  <div className="flex">
                    <p className="me-3">{item.number}</p>
                    <div>
                      <p>{item.title}</p>
                      <span className="text-xs font-thin">
                        {item.timecreated}
                      </span>
                    </div>
                  </div>
                  <p className="font-bold text-xl ms-2">{item.get_point}</p>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>

      {/* modal */}
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
                      accept=".pdf, .mp4, .mp3, .mov, .MOV"
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
      {showInformation && (
        <>
          <div className="justify-end items-end flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full">
              {/*content*/}
              <div className="bg-transperancy-50 border-0 rounded-t-xl relative flex flex-col w-full outline-none focus:outline-none">
                <button
                  className="p-2 ml-auto border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowInformation(false)}
                >
                  <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
                <p className="text-xl font-bold text-center mb-3">
                  Informasi Nilai Poin
                </p>
                {informasiPoin.map((item) => (
                  <div className="border-b p-6 flex justify-between">
                    <div className="flex">
                      <p className="me-3">{item.number}</p>
                      <p>{item.title}</p>
                    </div>
                    <p className="font-bold text-xl ms-2">{item.point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
};

export default MyPoin;
