<?php

class books
{

    private static $tableName = 'book';

    public function getContent()
    {
        $ext = 'txt';
        if ($this->mimeType == 'application/pdf') {
            $ext = 'pdf';
        }
        return '/Library/WebServer/Documents/var/books/' . $this->getId() . '.' . $ext;
    }

    use Permission,
        DataAccess,
        Statistics,
        JSON,
        PathProcess,
        NormalFacadeImpl,
        Facade {
        DataAccess::IsPrimaryKey as isPrimary;
    }

    private $name = ''; //character varying(256),
    private $author = ''; //character varying(128),
    private $authorAlias = ''; //character varying(128),
    private $publisher = ''; //character varying(256),
    private $publishTime = ''; //character varying(16),
    private $isbn = ''; //character varying(24),
    private $standardClassify = ''; //character varying(16),
    private $firstLevelClassify = ''; //character varying(16),
    private $secondLevelClassify = ''; //character varying(16),
    private $authorizationEndTime = ''; //timestamp(4) without time zone,
    private $keywords = ''; //character varying(256),
    private $abstract = ''; //text,
    private $order = ''; //bigint,
    private $resourceId = ''; //bigint,
    private $lastUpdateTime = 'now'; //timestamp(4) without time zone,
    private $mimeType = '';

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function setAuthor($author)
    {
        $this->author = $author;
    }

    public function getAuthorAlias()
    {
        return $this->authorAlias;
    }

    public function setAuthorAlias($authorAlias)
    {
        $this->authorAlias = $authorAlias;
    }

    public function getPublisher()
    {
        return $this->publisher;
    }

    public function setPublisher($publisher)
    {
        $this->publisher = $publisher;
    }

    public function getPublishTime()
    {
        return $this->publishTime;
    }

    public function setPublishTime($publishTime)
    {
        $this->publishTime = $publishTime;
    }

    public function getIsbn()
    {
        return $this->isbn;
    }

    public function setIsbn($isbn)
    {
        $this->isbn = $isbn;
    }

    public function getStandardClassify()
    {
        return $this->standardClassify;
    }

    public function setStandardClassify($standardClassify)
    {
        $this->standardClassify = $standardClassify;
    }

    public function getFirstLevelClassify()
    {
        return $this->firstLevelClassify;
    }

    public function setFirstLevelClassify($firstLevelClassify)
    {
        $this->firstLevelClassify = $firstLevelClassify;
    }

    public function getSecondLevelClassify()
    {
        return $this->secondLevelClassify;
    }

    public function setSecondLevelClassify($secondLevelClassify)
    {
        $this->secondLevelClassify = $secondLevelClassify;
    }

    public function getAuthorizationEndTime()
    {
        return $this->authorizationEndTime;
    }

    public function setAuthorizationEndTime($authorizationEndTime)
    {
        $this->authorizationEndTime = $authorizationEndTime;
    }

    public function getKeywords()
    {
        return $this->keywords;
    }

    public function setKeywords($keywords)
    {
        $this->keywords = $keywords;
    }

    public function getAbstract()
    {
        return $this->abstract;
    }

    public function setAbstract($abstract)
    {
        $this->abstract = $abstract;
    }

    public function getOrder()
    {
        return $this->order;
    }

    public function setOrder($order)
    {
        $this->order = $order;
    }

    public function getResourceId()
    {
        return $this->resourceId;
    }

    public function setResourceId($resourceId)
    {
        $this->resourceId = $resourceId;
    }

    public function getLastUpdateTime()
    {
        return $this->lastUpdateTime;
    }

    public function setLastUpdateTime($lastUpdateTime)
    {
        $this->lastUpdateTime = $lastUpdateTime;
    }

    public function getMimeType()
    {
        return $this->mimeType;
    }

    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;
    }

}

?>
