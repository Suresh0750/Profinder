

import ShowCategoryDetails from '../../../../../components/Admin/Category/category'

export default function Category() {

    return (
        <>
            <section className='mt-[3.5em]'>
                <h2 className="text-white text-4xl font-bold bg-opacity-85 text-center">Category Management</h2>
                <div className='flex flex-col w-[90%] ml-[113px] mt-[31px] h-[40%]'>
                    <ShowCategoryDetails />
                </div>
                
            </section>
        </>
    );
}
