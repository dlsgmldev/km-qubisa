import pic from "../../assets/Ellipse 253.svg";
import award1 from "../../assets/Award 4.svg";
import award2 from "../../assets/Award 5.svg";
import award3 from "../../assets/Award 6.svg";
import poin from "../../assets/Poin Vector PNG-01 1.svg";

const Ranking = () => {
  return (
    <div className="">
      <div className="flex p-4">
        <i className="fa-solid fa-chevron-left text-xl me-4"></i>
        <p className="text-xl font-bold">My Rank</p>
      </div>
      <div className="bg-transperancy-50 p-6 flex justify-center">
        <img src={poin} />
        <div className="ms-3">
          <p className="text-[40px] font-bold">90</p>
          <p>Poin Tersedia</p>
        </div>
      </div>
      <div className="bg-transperancy-50 border-b p-6 flex justify-between mt-2">
        <div className="flex">
          <p>1</p>
          <img className="mx-3" src={pic} />
          <p>John Thor</p>
        </div>
        <div className="flex">
          <img src={award1} width={30} height="auto" />
          <p className="font-bold text-xl ms-2">90</p>
        </div>
      </div>
      <div className="bg-transperancy-50 border-b p-6 flex justify-between">
        <div className="flex">
          <p>2</p>
          <img className="mx-3" src={pic} />
          <p>John Thor</p>
        </div>
        <div className="flex">
          <img src={award2} width={30} height="auto" />
          <p className="font-bold text-xl ms-2">90</p>
        </div>
      </div>
      <div className=" bg-transperancy-50 border-b p-6 flex justify-between">
        <div className="flex">
          <p>3</p>
          <img className="mx-3" src={pic} />
          <p>John Thor</p>
        </div>
        <div className="flex">
          <img src={award3} width={30} height="auto" />
          <p className="font-bold text-xl ms-2">90</p>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
