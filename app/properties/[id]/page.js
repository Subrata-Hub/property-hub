"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
const PropertyPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  console.log("Hellow");
  return (
    <div>
      <div>property Page</div>
      <button onClick={() => router.push("/")} className="bg-blue-500 p-2">
        Go Home {name}
      </button>
    </div>
  );
};

export default PropertyPage;
