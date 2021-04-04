import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <header className={styles.banner}>
        <img
          src="https://images.unsplash.com/photo-1564865878688-9a244444042a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
          alt="banner"
        />
      </header>

      <main className={styles.container}>
        {/* a tag article é usada para posts e artigos */}
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.info}>
            <FiCalendar color="#bbbbbb" />
            <time>{post.first_publication_date}</time>
            <FiUser color="#bbbbbb" />
            <span>{post.data.author}</span>
            <FiClock color="#bbbbbb" />
            <time>{post.first_publication_date}</time>
          </div>
          {/* dangerouslySetInnerHTML converte o html trazido do prismic
         para que o react possa renderizalo corretamente.*/}
          {/* !!!IMPORTANT!!!: usar dangerouslySetInnerHTML é perigoso,
         pois pode permitir roubo de dados dos cookies.  */}
          {/* Como aqui esta sendo usado somente para o prismic,
         o prismic assegura o uso dele evitando isso. */}
          <div
            className={styles.postContent}
            // dangerouslySetInnerHTML={{ __html: post.content }}
          >
            Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss, é um
            leite divinis, qui tem lupuliz, matis, aguis e fermentis. Aenean
            aliquam molestie leo, vitae iaculis nisl. Si u mundo tá muito
            paradis? Toma um mé que o mundo vai girarzis! Paisis, filhis,
            <a>espiritis santis</a>.
            <br />
            <br />
            Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss, é um
            leite divinis, qui tem lupuliz, matis, aguis e fermentis. Aenean
            aliquam molestie leo, vitae iaculis nisl. Si u mundo tá muito
            paradis? Toma um mé que o mundo vai girarzis! Paisis, filhis,
            espiritis santis.
            <br />
            <br />
            Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss, é um
            leite divinis, qui tem lupuliz, matis, aguis e fermentis. Aenean
            aliquam molestie leo, vitae iaculis nisl. Si u mundo tá muito
            paradis? Toma um mé que o mundo vai girarzis! Paisis, filhis,
            espiritis santis.
            <br />
            <br />
            Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss, é um
            leite divinis, qui tem lupuliz, matis, aguis e fermentis. Aenean
            aliquam molestie leo, vitae iaculis nisl. Si u mundo tá muito
            paradis? Toma um mé que o mundo vai girarzis! Paisis, filhis,
            espiritis santis.
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(TODO);

  // TODO
};

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   params,
// }) => {
//   const session = await getSession({ req });
//   const { slug } = params;

//   if (!session?.activeSubscription) {
//     return {
//       redirect: {
//         destination: `/posts/preview/${slug}`,
//         permanent: false,
//       },
//     };
//   }

//   const prismic = getPrismicClient(req);

//   //query de busca por ID
//   //slug = id
//   const response = await prismic.getByUID('post', String(slug), {});

//   const post = {
//     slug,
//     title: RichText.asText(response.data.title),
//     content: RichText.asHtml(response.data.content),
//     updatedAt: new Date(response.last_publication_date).toLocaleDateString(
//       'pt-BR',
//       {
//         day: '2-digit',
//         month: 'long',
//         year: 'numeric',
//       }
//     ),
//   };

//   return {
//     props: {
//       post,
//     },
//   };
// };
