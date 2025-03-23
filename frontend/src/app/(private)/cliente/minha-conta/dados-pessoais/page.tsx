import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { Pencil } from "lucide-react";

export default async function ProfileData() {
   return (
      <>
         <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-start px-20">
            <div className="w-full px-4 py-8">
               <div className="flex items-center justify-between rounded-md bg-white p-4">
                  <div className="flex items-center">
                     <div>
                        <div className="relative max-h-[60px] cursor-pointer lg:max-h-[80px]">
                           <img
                              className="h-[60px] w-[60px] rounded-full shadow-lg lg:h-[80px] lg:w-[80px]"
                              src="https://static.kabum.com.br/conteudo/temas/001/imagens/k5/images/profile_ninja.png"
                              alt="Ninja"
                              width="80"
                              height="80"
                           />
                           <div className="absolute bottom-0 right-0 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black-400">
                              <svg
                                 width="12"
                                 height="12"
                                 viewBox="0 0 14 14"
                                 fill="none"
                                 xmlns="https://www.w3.org/2000/svg"
                                 className="IconCamera"
                              >
                                 <path
                                    d="M7 9.9951C8.23712 9.9951 9.24 8.97364 9.24 7.71361C9.24 6.45359 8.23712 5.43213 7 5.43213C5.76288 5.43213 4.76 6.45359 4.76 7.71361C4.76 8.97364 5.76288 9.9951 7 9.9951Z"
                                    fill="#ff6500"
                                 ></path>
                                 <path
                                    d="M4.9 0.583984L3.619 2.00991H1.4C0.63 2.00991 0 2.65158 0 3.43584V11.9914C0 12.7757 0.63 13.4173 1.4 13.4173H12.6C13.37 13.4173 14 12.7757 14 11.9914V3.43584C14 2.65158 13.37 2.00991 12.6 2.00991H10.381L9.1 0.583984H4.9ZM7 11.2784C5.068 11.2784 3.5 9.68139 3.5 7.71361C3.5 5.74584 5.068 4.1488 7 4.1488C8.932 4.1488 10.5 5.74584 10.5 7.71361C10.5 9.68139 8.932 11.2784 7 11.2784Z"
                                    fill="#ff6500"
                                 ></path>
                              </svg>
                           </div>
                        </div>
                     </div>
                     <div className="ml-4 flex flex-col">
                        <span className="text-black-900 text-xl font-bold">
                           Bem-vindo, Vinicius Soares De Santana
                        </span>
                        <span className="flex items-center gap-2 text-black-800">
                           <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              xmlns="https://www.w3.org/2000/svg"
                              className="IconSellerEmail"
                           >
                              <path
                                 fillRule="evenodd"
                                 clipRule="evenodd"
                                 d="M13.4485 0.433594H13.4465H0.553458H0.551435C0.473286 0.433895 0.439462 0.533453 0.499509 0.583465L5.56579 4.80217L5.56759 4.80367L6.34817 5.45366C6.72584 5.76817 7.27412 5.76817 7.65179 5.45366L13.5004 0.583465C13.5605 0.533426 13.5266 0.433867 13.4485 0.433594ZM9.07015 4.99293L13.9916 0.894788C13.9967 0.924921 14 0.955655 14 0.987155V8.27383L9.07015 4.99293ZM8.006 5.87908L8.62641 5.36247L14 8.93874V9.0124C14 9.31758 13.7517 9.56589 13.4465 9.56589H0.553492C0.248309 9.56589 0 9.31758 0 9.0124V8.93874L5.37365 5.36247L5.99405 5.87908C6.28548 6.12178 6.64278 6.24313 7.00003 6.24313C7.35727 6.24313 7.71455 6.12178 8.006 5.87908ZM0 0.987155C0 0.955601 0.00325391 0.924921 0.00833984 0.894788L4.92983 4.99291L0 8.27383V0.987155Z"
                                 fill="#FF6500"
                              ></path>
                           </svg>
                           vsss23@hotmail.com
                        </span>
                     </div>
                  </div>
                  <Button
                     className="font-xl"
                     variant={"primary-orange"}
                     icon={<Pencil />}
                  >
                     EDITAR DADOS
                  </Button>
               </div>

               <div className="mb-4 mt-6 flex flex-col">
                  <div className="flex items-center">
                     <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="https://www.w3.org/2000/svg"
                        className="IconShortcut"
                     >
                        <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M9 4.5C9 6.98528 6.98528 9 4.5 9C2.01472 9 0 6.98528 0 4.5C0 2.01472 2.01472 0 4.5 0C6.98528 0 9 2.01472 9 4.5ZM9 19.5C9 21.9853 6.98528 24 4.5 24C2.01472 24 0 21.9853 0 19.5C0 17.0147 2.01472 15 4.5 15C6.98528 15 9 17.0147 9 19.5ZM19.5 9C21.9853 9 24 6.98528 24 4.5C24 2.01472 21.9853 0 19.5 0C17.0147 0 15 2.01472 15 4.5C15 6.98528 17.0147 9 19.5 9ZM24 19.5C24 21.9853 21.9853 24 19.5 24C17.0147 24 15 21.9853 15 19.5C15 17.0147 17.0147 15 19.5 15C21.9853 15 24 17.0147 24 19.5Z"
                           fill="#FF6500"
                        ></path>
                     </svg>
                     <span className="ml-2 text-sm font-bold uppercase text-black-800 lg:text-xl">
                        Atalhos
                     </span>
                  </div>
               </div>

               <div className="rounded-4 grid grid-cols-2 gap-8 lg:grid-cols-3 lg:gap-16">
                  <a
                     className="rounded-4 [&amp;_svg]:w-20 [&amp;_svg]:h-20 lg:[&amp;_svg]:w-32 lg:[&amp;_svg]:h-32 flex h-56 items-center justify-center bg-white p-16 lg:h-[128px]"
                     href="minha-conta/meus-dados"
                  >
                     <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="https://www.w3.org/2000/svg"
                        className="IconUser"
                     >
                        <path
                           d="M9 8.52632C9 13.2272 13.038 17.0526 18 17.0526C22.962 17.0526 27 13.2272 27 8.52632C27 3.82547 22.962 0 18 0C13.038 0 9 3.82547 9 8.52632ZM34 36H36V34.1053C36 26.7935 29.718 20.8421 22 20.8421H14C6.28 20.8421 0 26.7935 0 34.1053V36H34Z"
                           fill="#ff6500"
                        ></path>
                     </svg>
                     <span className="text-xxs ml-12 font-semibold uppercase text-black-800 lg:ml-20 lg:max-w-[244px] lg:text-base">
                        Meus dados
                        <span className="text-black-700 hidden lg:flex lg:text-sm lg:font-normal lg:normal-case">
                           Altere seus dados cadastrados, endereços ou cadastre
                           um novo endereço.
                        </span>
                     </span>
                  </a>

                  <a
                     className="rounded-4 flex h-56 items-center justify-center bg-white p-16 lg:h-[128px]"
                     href="minha-conta/meus-dados"
                  >
                     <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="https://www.w3.org/2000/svg"
                        className="IconUser"
                     >
                        <path
                           d="M9 8.52632C9 13.2272 13.038 17.0526 18 17.0526C22.962 17.0526 27 13.2272 27 8.52632C27 3.82547 22.962 0 18 0C13.038 0 9 3.82547 9 8.52632ZM34 36H36V34.1053C36 26.7935 29.718 20.8421 22 20.8421H14C6.28 20.8421 0 26.7935 0 34.1053V36H34Z"
                           fill="#ff6500"
                        ></path>
                     </svg>
                     <span className="ml-12 text-xs font-semibold uppercase text-black-800 lg:ml-20 lg:max-w-[244px] lg:text-base">
                        Meus dados
                        <span className="text-black-700 hidden lg:flex lg:text-sm lg:font-normal lg:normal-case">
                           Altere seus dados cadastrados, endereços ou cadastre
                           um novo endereço.
                        </span>
                     </span>
                  </a>
               </div>
            </div>
         </div>
      </>
   );
}

// https://v0.dev/t/UIhg8R5Orpt
// https://v0.dev/t/UIhg8R5Orpt
// https://v0.dev/t/UIhg8R5Orpt
// https://v0.dev/t/UIhg8R5Orpt
// https://v0.dev/t/UIhg8R5Orpt
