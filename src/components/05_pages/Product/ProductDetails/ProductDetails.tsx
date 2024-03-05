import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { pb } from '@/api/pocketbase';
import { useState } from 'react';
import SelectModal from '@/components/02_molecules/Modal/SelectModal/SelectModal';
import { Divider } from '@/components/01_atoms/Divider/Divider';
import ProductDetailsInfo from '@/components/04_templates/ProductDetails/ProductDetailsInfo/ProductDetailsInfo';
import { useQuery } from '@tanstack/react-query';

export function ProductDetails() {
  const { productId } = useParams();
  const product = useLoaderData();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { data } = useQuery({
    queryKey: ['productDetail', productId],
    queryFn: () => fetchSingleProduct(productId),
    initialData: product,
  });

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleMoveToMyCart = () => {
    navigate('/Payment');
  };

  return (
    <div className="pt-20 w-[75rem] m-auto flex flex-col">
      <ProductDetailsInfo productData={data} onOpenModal={handleOpenModal} />
      <Divider />
      <section className="flex flex-col text-center">
        <h2 className="text-3xl">관련 상품</h2>
        <ul className="flex flex-row">
          <li>아이템</li>
          <li>아이템</li>
        </ul>
      </section>
      {showModal && (
        <SelectModal
          title="장바구니 담기 완료"
          onClose={handleCloseModal}
          onLink={handleMoveToMyCart}
        >
          <p>구매하기 페이지로 넘어가시겠습니까?</p>
        </SelectModal>
      )}
    </div>
  );
}

async function fetchSingleProduct(productId: string) {
  return await pb.collection('product').getOne(productId);
}

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { productId } = params;
    return await queryClient.ensureQueryData({
      queryKey: ['productDetail', productId],
      queryFn: () => fetchSingleProduct(productId),
      cacheTime: 6000 * 10,
      staleTime: 1000 * 10,
    });
  };
